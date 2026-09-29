"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "ai";
import { DefaultChatTransport } from "ai";
import { MessageCircle, Send, ShieldCheck, Square } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
} from "@/components/ui/announcement";
import { Loader } from "@/components/ui/loader";
import {
  chatIntentCategory,
  messageLengthBucket,
  trackEvent,
} from "@/lib/analytics";
import { chatSuggestions } from "@/lib/portfolio-data";
import { cn } from "@/lib/utils";

const MAX_CHAT_CHARS = 1000;
const LIMIT_WARNING_AT = 850;
const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const avatarChoices = [
  { id: "spongebob", image: "/avatars/spongebob.png", label: "SpongeBob" },
  { id: "sandy", image: "/avatars/sandy.png", label: "Sandy" },
  { id: "squidward", image: "/avatars/squidward.png", label: "Squidward" },
  { id: "mr-krabs", image: "/avatars/mr-krabs.png", label: "Mr. Krabs" },
] as const;

type AvatarChoice = (typeof avatarChoices)[number];

type VisitorProfile = {
  avatar: AvatarChoice;
  name: string;
  storageConsent: boolean;
  sessionId: string;
};

type Grecaptcha = {
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
  ready: (callback: () => void) => void;
};

declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

function messageText(message: UIMessage) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

async function getRecaptchaToken() {
  if (!RECAPTCHA_SITE_KEY || typeof window === "undefined") {
    return undefined;
  }

  if (!window.grecaptcha) {
    return undefined;
  }

  return new Promise<string | undefined>((resolve) => {
    window.grecaptcha?.ready(() => {
      window.grecaptcha
        ?.execute(RECAPTCHA_SITE_KEY, { action: "portfolio_chat" })
        .then(resolve)
        .catch(() => resolve(undefined));
    });
  });
}

function VisitorAvatar({ profile }: { profile: VisitorProfile }) {
  return (
    <span className="chat-inline-avatar character-avatar">
      <Image
        alt={`${profile.avatar.label} avatar`}
        fill
        sizes="34px"
        src={profile.avatar.image}
      />
    </span>
  );
}

function MessageName({ name }: { name: string }) {
  return <span className="chat-message-name">{name}</span>;
}

function JustinAvatar() {
  return (
    <span className="chat-inline-avatar justin-avatar">
      <Image alt="Justin Alvaran" fill sizes="34px" src="/profile.jpg" />
    </span>
  );
}

export function PortfolioChat() {
  const [input, setInput] = useState("");
  const [draftName, setDraftName] = useState("");
  const [recaptchaReady, setRecaptchaReady] = useState(!RECAPTCHA_SITE_KEY);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarChoice>(avatarChoices[0]);
  const [storageConsent, setStorageConsent] = useState(false);
  const [visitorProfile, setVisitorProfile] = useState<VisitorProfile | null>(null);

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) {
      return;
    }

    if (window.grecaptcha) {
      window.grecaptcha.ready(() => setRecaptchaReady(true));
      return;
    }

    const existingScript = document.querySelector("[data-recaptcha-script]");

    if (existingScript) {
      existingScript.addEventListener(
        "load",
        () => window.grecaptcha?.ready(() => setRecaptchaReady(true)),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.dataset.recaptchaScript = "true";
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.onload = () => window.grecaptcha?.ready(() => setRecaptchaReady(true));
    document.head.append(script);
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
      }),
    [],
  );

  const { messages, sendMessage, status, stop, error, regenerate } = useChat({
    onFinish: ({ isAbort, isDisconnect, isError }) => {
      if (isAbort) {
        trackEvent("chat_response_stopped");
        return;
      }

      if (isError || isDisconnect) {
        trackEvent("chat_response_failed", {
          failure_stage: isDisconnect ? "stream_disconnected" : "provider_request",
        });
        return;
      }

      trackEvent("chat_response_completed");
    },
    transport,
  });

  const busy = status === "submitted" || status === "streaming";
  const approachingLimit = input.length >= LIMIT_WARNING_AT;

  const startChat = () => {
    const name = draftName.trim();

    if (!name) {
      return;
    }

    const profile = {
      avatar: selectedAvatar,
      name,
      sessionId: crypto.randomUUID(),
      storageConsent,
    };
    setVisitorProfile(profile);
    trackEvent("chat_started", {
      avatar_choice: selectedAvatar.id,
      has_display_name: true,
    });
  };

  const submit = async (text = input, source: "suggestion" | "typed" = "typed") => {
    const trimmed = text.trim();

    if (!visitorProfile || !trimmed || busy || trimmed.length > MAX_CHAT_CHARS) {
      return;
    }

    trackEvent("chat_message_sent", {
      intent_category: chatIntentCategory(trimmed),
      message_length_bucket: messageLengthBucket(trimmed.length),
      message_source: source,
    });
    setInput("");

    try {
      await sendMessage(
        { text: trimmed },
        {
          body: {
            chatSessionId: visitorProfile.sessionId,
            intentCategory: chatIntentCategory(trimmed),
            recaptchaToken: await getRecaptchaToken(),
            storageConsent: visitorProfile.storageConsent,
            visitorName: visitorProfile.name,
          },
        },
      );
    } catch {
      trackEvent("chat_response_failed", { failure_stage: "request_setup" });
    }
  };

  return (
    <div className="chat-dock" id="chat">
      <details
        className="chat-details"
        onToggle={(event) =>
          trackEvent("chat_panel_toggled", {
            panel_state: event.currentTarget.open ? "opened" : "closed",
          })
        }
      >
        <summary aria-label="Open Justin chat" className="chat-launcher">
          <MessageCircle size={18} />
          <span>Ask Justin&apos;s portfolio</span>
        </summary>

        <section className="chat-panel" aria-label="Chat with Just">
          <header>
            <div>
              <span className="chat-avatar">
                <Image alt="Justin Alvaran" fill sizes="38px" src="/profile.jpg" />
              </span>
              <div>
                <strong>Chat with Just</strong>
                {visitorProfile && <p>Chatting as {visitorProfile.name}</p>}
              </div>
            </div>
            {busy && (
              <button
                aria-label="Stop response"
                onClick={() => {
                  stop();
                }}
                type="button"
              >
                <Square size={14} />
              </button>
            )}
          </header>

          {!visitorProfile ? (
            <div className="chat-onboarding">
              <div>
                <strong>Select your avatar</strong>
                <p>Choose an avatar and enter your name before chatting with Just.</p>
              </div>
              <div className="avatar-picker" role="radiogroup" aria-label="Choose avatar">
                {avatarChoices.map((avatar) => (
                  <button
                    aria-checked={selectedAvatar.id === avatar.id}
                    className={cn(selectedAvatar.id === avatar.id && "is-selected", `avatar-${avatar.id}`)}
                    key={avatar.id}
                    onClick={() => {
                      setSelectedAvatar(avatar);
                      trackEvent("chat_avatar_selected", { avatar_choice: avatar.id });
                    }}
                    role="radio"
                    type="button"
                  >
                    <span className="avatar-image">
                      <Image
                        alt={`${avatar.label} avatar`}
                        fill
                        sizes="40px"
                        src={avatar.image}
                      />
                    </span>
                    <span>{avatar.label}</span>
                  </button>
                ))}
              </div>
              <form
                className="chat-name-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  startChat();
                }}
              >
                <input
                  aria-label="Your chat name"
                  maxLength={28}
                  onChange={(event) => setDraftName(event.target.value)}
                  placeholder="Your name"
                  value={draftName}
                />
                <label className="chat-storage-consent">
                  <input
                    checked={storageConsent}
                    onChange={(event) => setStorageConsent(event.target.checked)}
                    type="checkbox"
                  />
                  <span>Allow Justin to review this chat for up to 30 days. Emails, phone numbers, and credentials are redacted.</span>
                </label>
                <button disabled={!draftName.trim()} type="submit">
                  Start
                </button>
              </form>
            </div>
          ) : (
            <>
              <Conversation className="chat-conversation">
                <ConversationContent className="chat-messages">
                  {messages.length === 0 ? (
                    <div className="chat-empty">
                      <strong>Ask about projects, stack, AWS work, or contact info.</strong>
                      <div>
                        {chatSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => void submit(suggestion, "suggestion")}
                            type="button"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        className={cn(
                          "chat-message-row",
                          message.role === "user" && "is-user",
                        )}
                        key={message.id}
                      >
                        {message.role === "user" ? (
                          <VisitorAvatar profile={visitorProfile} />
                        ) : (
                          <JustinAvatar />
                        )}
                        <Message from={message.role}>
                          {message.role === "user" && (
                            <MessageName name={visitorProfile.name} />
                          )}
                          <MessageContent
                            className={cn(
                              message.role === "user"
                                ? "chat-user-message"
                                : "chat-ai-message",
                            )}
                          >
                            <MessageResponse>{messageText(message)}</MessageResponse>
                          </MessageContent>
                        </Message>
                      </div>
                    ))
                  )}
                  {busy && (
                    <div className="chat-thinking">
                      <JustinAvatar />
                      <Loader variant="terminal" size="sm" />
                      <Loader text="Thinking" variant="text-shimmer" size="sm" />
                    </div>
                  )}
                  {error && (
                    <div className="chat-error">
                      <span>Request failed or the rate limit was reached.</span>
                      <button
                        onClick={async () => {
                          const latestUserMessage = [...messages]
                            .reverse()
                            .find((message) => message.role === "user");
                          const latestUserText = latestUserMessage ? messageText(latestUserMessage) : "";
                          trackEvent("chat_response_retried");
                          await regenerate({
                            body: {
                              chatSessionId: visitorProfile.sessionId,
                              intentCategory: chatIntentCategory(latestUserText),
                              recaptchaToken: await getRecaptchaToken(),
                              storageConsent: visitorProfile.storageConsent,
                              visitorName: visitorProfile.name,
                            },
                          });
                        }}
                        type="button"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </ConversationContent>
                <ConversationScrollButton />
              </Conversation>

              <form
                className="chat-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  void submit();
                }}
              >
                {approachingLimit && (
                  <Announcement themed className="chat-limit-warning">
                    <AnnouncementTag>Warning</AnnouncementTag>
                    <AnnouncementTitle>Approaching your limit</AnnouncementTitle>
                  </Announcement>
                )}
                <textarea
                  aria-label="Ask Justin"
                  disabled={busy}
                  maxLength={MAX_CHAT_CHARS}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void submit();
                    }
                  }}
                  placeholder={`Ask as ${visitorProfile.name}...`}
                  rows={2}
                  value={input}
                />
                <div className="chat-send-row">
                  <span className={cn("chat-char-count", approachingLimit && "is-warning")}>
                    {input.length}/{MAX_CHAT_CHARS}
                  </span>
                  <div className="chat-send-actions">
                    {RECAPTCHA_SITE_KEY && (
                      <span className={cn("chat-recaptcha-state", recaptchaReady && "is-ready")}>
                        <ShieldCheck size={13} />
                        reCAPTCHA ready
                      </span>
                    )}
                    <button
                      aria-label="Send message"
                      disabled={busy || !input.trim() || (Boolean(RECAPTCHA_SITE_KEY) && !recaptchaReady)}
                      type="submit"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </form>
            </>
          )}
        </section>
      </details>
    </div>
  );
}
