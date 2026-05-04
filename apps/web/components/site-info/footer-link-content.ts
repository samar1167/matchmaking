export type FooterInfoSection = {
  eyebrow: string;
  title: string;
  description: string;
  points: string[];
};

export type FooterInfoPageContent = {
  eyebrow: string;
  title: string;
  description: string;
  badgeLabel: string;
  badgeValue: string;
  statLabel: string;
  statValue: string;
  sections: FooterInfoSection[];
};

export const footerInfoPages: Record<string, FooterInfoPageContent> = {
  "about-us": {
    eyebrow: "about luster",
    title: "A more thoughtful way to understand compatibility",
    description:
      "Luster is a matchmaking and compatibility platform built to help people make relationship decisions with more clarity, more structure, and more confidence. We believe meaningful connections deserve better tools than guesswork, vague advice, or endless swiping without context.",
    badgeLabel: "Built for",
    badgeValue: "Private matching, clearer decisions, stronger connections",
    statLabel: "Our aim",
    statValue: "Help people understand fit before they invest emotionally",
    sections: [
      {
        eyebrow: "Our Mission",
        title: "Make compatibility easier to understand and easier to act on",
        description:
          "Luster exists to make relationship decision-making more informed. Instead of leaving people to navigate one of life’s most important choices through instinct alone, we create a product experience that brings structure, reflection, and practical insight into the process.",
        points: [
          "We help users move from uncertainty to understanding before they commit time, energy, and trust.",
          "We focus on compatibility as a decision-support experience, not just a matching mechanic.",
          "We aim to make thoughtful relationship choices feel calmer, clearer, and more grounded.",
        ],
      },
      {
        eyebrow: "What We Do",
        title: "Turn personal matchmaking questions into a usable workflow",
        description:
          "Luster combines private profile management, compatibility analysis, and connection discovery in one place. Users can save profiles, review compatibility with context, and explore potential matches with a stronger sense of why someone may be a meaningful fit.",
        points: [
          "Private profile tools help users organize the people they want to evaluate without starting over each time.",
          "Compatibility views highlight stronger and weaker areas so users can look beyond a single headline score.",
          "Connection features help users focus on people who may align more closely with their goals, values, and preferences.",
        ],
      },
      {
        eyebrow: "Why We Built It",
        title: "Because relationship decisions deserve more than guesswork",
        description:
          "Many platforms optimize for attention, speed, or endless browsing. Luster is built around a different idea: when people are making serious relationship choices, they need context they can actually use.",
        points: [
          "A meaningful match is not only about attraction. It is also about alignment, expectations, and long-term fit.",
          "Users should be able to revisit insights, compare thoughtfully, and make decisions at their own pace.",
          "The product is designed to reduce noise and help users focus on what matters most in real compatibility.",
        ],
      },
      {
        eyebrow: "Who We Serve",
        title: "Built for people seeking more intentional relationships",
        description:
          "Luster is for users who want a more deliberate matchmaking experience, whether they are evaluating someone they already know or looking to meet compatible people through the platform.",
        points: [
          "People exploring a serious relationship and looking for more confidence before taking the next step.",
          "Users who want to compare compatibility privately before turning curiosity into commitment.",
          "Individuals who value depth, context, and intentional matching over shallow discovery flows.",
        ],
      },
      {
        eyebrow: "Our Principles",
        title: "Privacy, clarity, and human-centered product decisions",
        description:
          "The product is shaped by a simple standard: if people are trusting us with personal relationship information, the experience should respect that trust at every stage.",
        points: [
          "Privacy matters because matchmaking and compatibility data are deeply personal.",
          "Clarity matters because people should understand what insights mean and how to use them.",
          "Human-centered design matters because the goal is not more activity for its own sake, but better decisions and better connections.",
        ],
      },
      {
        eyebrow: "Looking Ahead",
        title: "Building a stronger foundation for modern matchmaking",
        description:
          "Luster is being shaped as a platform that can support richer compatibility tools, better connection experiences, and more trust-centered relationship workflows over time.",
        points: [
          "We want every feature to help users move from interest to understanding to connection with less friction.",
          "We see compatibility as an evolving product area that should grow more useful as the platform matures.",
          "Our long-term vision is a matchmaking experience that feels credible, calm, and genuinely helpful in real life.",
        ],
      },
    ],
  },
  "how-it-works": {
    eyebrow: "product flow",
    title: "How Luster guides the compatibility journey",
    description:
      "From profile setup to compatibility review and meaningful connections, the product is structured to keep every step understandable and easy to revisit.",
    badgeLabel: "Workflow",
    badgeValue: "Profile → Compare → Connect",
    statLabel: "Typical use",
    statValue: "Discover compatible people and revisit insights anytime",
    sections: [
      {
        eyebrow: "Step One",
        title: "Create and maintain private profiles",
        description:
          "Users can build a private list of people they want to evaluate later, keeping the workspace neat and repeatable.",
        points: [
          "Add accurate birth details for a reliable baseline.",
          "Keep multiple private profiles available in one place.",
          "Return later without rebuilding the same entries.",
        ],
      },
      {
        eyebrow: "Step Two",
        title: "Run compatibility checks with context",
        description:
          "Results are presented as structured compatibility signals so the user can understand both the score and the reason behind it.",
        points: [
          "Scores surface stronger and weaker areas quickly.",
          "Detailed breakdowns support a more informed decision.",
          "Premium parameters can expand the depth when needed.",
        ],
      },
      {
        eyebrow: "Step Three",
        title: "Make connections with compatible people",
        description:
          "After understanding compatibility, users can move forward with more confidence and explore connections with people who align with their relationship goals and values.",
        points: [
          "Compatibility insights help narrow attention toward stronger matches.",
          "Making connections becomes easier when users already know who fits them better.",
          "The journey shifts from guessing who might work to meeting people with real potential.",
        ],
      },
    ],
  },
  "privacy-policy": {
    eyebrow: "privacy policy",
    title: "Privacy Policy",
    description:
      "This Privacy Policy explains how Luster collects, uses, stores, shares, and protects personal information when users create accounts, build profiles, request compatibility insights, and make connections through the platform.",
    badgeLabel: "Coverage",
    badgeValue: "Accounts, profiles, matching, payments, and support",
    statLabel: "Applies to",
    statValue: "Website, accounts, subscriptions, and matchmaking features",
    sections: [
      {
        eyebrow: "1. Information We Collect",
        title: "Account, profile, and matchmaking information",
        description:
          "We collect information users provide directly, information generated through use of the product, and limited technical information needed to operate, secure, and improve the service.",
        points: [
          "Account information may include name, email address, phone number, login credentials, billing identifiers, and account preferences.",
          "Profile information may include date of birth, time of birth, place of birth, gender, relationship preferences, biography details, interests, photos, and other data submitted for compatibility or matchmaking purposes.",
          "Matchmaking activity may include saved profiles, compatibility results, connection requests, conversations, favorites, blocks, reports, and user feedback.",
          "Technical information may include IP address, device type, browser type, app logs, cookies, usage events, and approximate location derived from network data.",
        ],
      },
      {
        eyebrow: "2. How We Use Information",
        title: "To run the product and improve matchmaking outcomes",
        description:
          "We use personal information to provide the service users request, personalize the product experience, maintain security, and operate the business responsibly.",
        points: [
          "We use submitted profile data to generate compatibility insights, suggest relevant matches, and help users connect with people who may align with their stated goals and preferences.",
          "We use account and device data to authenticate users, prevent abuse, detect fraud, troubleshoot problems, and enforce our policies.",
          "We use transaction and subscription data to process payments, manage paid access, issue receipts, and respond to billing requests.",
          "We may use aggregated or de-identified data to understand product performance, improve features, and evaluate service quality without identifying individual users.",
        ],
      },
      {
        eyebrow: "3. Sharing and Visibility",
        title: "When information is shown to others or shared with providers",
        description:
          "Some information is visible by design inside the matchmaking experience, while other information is shared only with service providers or when required by law.",
        points: [
          "Profile details, connection status, and messages may be visible to other users depending on product settings, feature design, and the actions a user takes on the platform.",
          "Private saved profiles created only for internal comparison or private analysis are not intended to be publicly visible unless the product explicitly asks the user to publish or share them.",
          "We may share information with payment processors, hosting providers, analytics vendors, communications providers, customer support tools, and security partners that help us operate the service.",
          "We may disclose information when reasonably necessary to comply with legal obligations, protect users, investigate misuse, or enforce our agreements.",
        ],
      },
      {
        eyebrow: "4. Sensitive and Matchmaking Data",
        title: "Special care for personal compatibility information",
        description:
          "Matchmaking and compatibility services can involve personal and sensitive information, so we limit access internally and use that information only for legitimate service-related purposes.",
        points: [
          "Birth details, gender, relationship preferences, compatibility scores, private notes, and connection history are treated as sensitive within the context of the service.",
          "We restrict employee and contractor access to personal information based on role and business need.",
          "Users should submit only information they have the right to share and should avoid adding sensitive third-party information without permission.",
          "Compatibility insights are intended to support personal decision-making and should not be treated as guarantees of relationship success, character, safety, or future behavior.",
        ],
      },
      {
        eyebrow: "5. Cookies, Analytics, and Communications",
        title: "Operational tracking and product communications",
        description:
          "We use common digital tools to keep users signed in, understand product usage, and communicate about accounts and services.",
        points: [
          "Cookies or similar technologies may be used for authentication, session continuity, performance measurement, preferences, and fraud prevention.",
          "We may send service-related emails, verification messages, security alerts, billing notices, feature updates, and support responses.",
          "Marketing communications should include a clear way to opt out where required by law, but users may still receive essential transactional or account messages.",
          "Browser controls, device settings, or in-product preferences may allow users to limit certain tracking or communication choices depending on the feature.",
        ],
      },
      {
        eyebrow: "6. Retention and Security",
        title: "How long we keep information and how we protect it",
        description:
          "We retain information for as long as reasonably necessary to provide the service, meet legal obligations, resolve disputes, and maintain legitimate business records.",
        points: [
          "Account, profile, compatibility, billing, and support records may be retained while an account remains active and for a reasonable period afterward.",
          "We use administrative, technical, and organizational safeguards designed to protect personal information from unauthorized access, misuse, loss, or alteration.",
          "No online platform can guarantee absolute security, and users are responsible for protecting their login credentials and using the service carefully.",
          "When retention is no longer necessary, we may delete, anonymize, or de-identify information subject to legal, operational, or safety requirements.",
        ],
      },
      {
        eyebrow: "7. User Rights and Choices",
        title: "Access, updates, deletion, and account controls",
        description:
          "Users may have legal rights over their personal information depending on where they live, and we aim to provide practical controls inside the product where possible.",
        points: [
          "Users can generally review and update profile information, manage connection activity, and request account closure through the product or support channels.",
          "Users may request access to, correction of, deletion of, or a copy of certain personal information, subject to identity verification and applicable law.",
          "Users may object to or limit certain uses of their information where local law provides that right.",
          "We may retain limited information after deletion requests when necessary for legal compliance, fraud prevention, dispute resolution, safety, or recordkeeping.",
        ],
      },
      {
        eyebrow: "8. Children, International Use, and Policy Changes",
        title: "Important additional privacy terms",
        description:
          "Because the service is designed for adult matchmaking, we apply additional rules around eligibility and updates to this policy.",
        points: [
          "The service is not intended for children, and users must be at least the minimum age required by applicable law and in no event younger than 18.",
          "If we learn that a child has provided personal information in violation of this policy, we may delete the account and associated data.",
          "Information may be processed in countries where we or our service providers operate, which may have different data protection rules than the user's home jurisdiction.",
          "We may update this Privacy Policy from time to time, and material changes should be communicated through the website, app, email, or other reasonable notice methods.",
        ],
      },
    ],
  },
  "terms-of-service": {
    eyebrow: "terms of use",
    title: "Terms of Use",
    description:
      "These Terms of Use govern access to and use of Luster, including user accounts, matchmaking features, compatibility tools, paid plans, and communication features made available through the platform.",
    badgeLabel: "Covers",
    badgeValue: "Access, conduct, subscriptions, safety, and liability",
    statLabel: "Binding on",
    statValue: "All users, visitors, subscribers, and account holders",
    sections: [
      {
        eyebrow: "1. Eligibility and Acceptance",
        title: "Who may use the service",
        description:
          "By using Luster, users agree to these Terms and confirm that they are legally permitted to use the service.",
        points: [
          "Users must be at least 18 years old and able to enter into a legally binding agreement.",
          "Users may not use the service if doing so would violate applicable law, regulation, or court order.",
          "If a user creates an account or uses the platform on behalf of another person or entity, that user represents that they have authority to do so.",
        ],
      },
      {
        eyebrow: "2. Accounts and User Responsibility",
        title: "Accurate information and secure account use",
        description:
          "Users are responsible for their account activity, the information they submit, and the consequences of using compatibility and connection features.",
        points: [
          "Users must provide accurate, current, and complete registration and profile information and keep it updated as needed.",
          "Users are responsible for maintaining the confidentiality of their login credentials and for all activity that occurs under their account.",
          "Users may not impersonate another person, misrepresent relationship intent, create deceptive profiles, or submit information they do not have the right to share.",
          "We may suspend or terminate accounts that appear false, fraudulent, abusive, unsafe, inactive for long periods, or otherwise in violation of these Terms.",
        ],
      },
      {
        eyebrow: "3. Matchmaking and Compatibility Services",
        title: "What the platform does and does not promise",
        description:
          "Luster provides tools to help users evaluate compatibility and discover possible connections, but it does not guarantee any specific outcome.",
        points: [
          "Compatibility scores, match suggestions, and related insights are informational tools intended to support user judgment, not replace it.",
          "We do not guarantee that any introduction, match, conversation, or relationship will result in compatibility, safety, mutual interest, or long-term success.",
          "Users are solely responsible for how they interpret results, whom they contact, and what decisions they make on or off the platform.",
          "Any matchmaking feature may evolve over time as the product changes, including the criteria, ranking, or presentation of results.",
        ],
      },
      {
        eyebrow: "4. Acceptable Use and Safety",
        title: "Rules for respectful and lawful use",
        description:
          "Because the product facilitates personal connections, users must treat one another respectfully and use the service in a safe, lawful, and non-exploitative manner.",
        points: [
          "Users may not harass, threaten, stalk, intimidate, exploit, defame, impersonate, or discriminate against other users.",
          "Users may not upload unlawful, sexually exploitative, fraudulent, hateful, violent, or invasive content or use the service for scams, solicitation abuse, or spam.",
          "Users may not attempt to scrape data, reverse engineer core systems, bypass access controls, or interfere with platform security or availability.",
          "Users should use caution when communicating or meeting with others and remain responsible for their own personal safety and offline interactions.",
        ],
      },
      {
        eyebrow: "5. User Content, Messages, and Reports",
        title: "Rights in submitted content and moderation authority",
        description:
          "Users retain ownership of the content they submit, but they give us the permissions needed to host, process, display, and moderate that content within the service.",
        points: [
          "By uploading or sending content, users grant Luster a non-exclusive, worldwide, royalty-free license to use, host, reproduce, adapt, display, and distribute that content as necessary to operate the platform.",
          "Users represent that they own or control the rights needed for the content they submit and that the content does not violate law or third-party rights.",
          "We may review, remove, restrict, or preserve content, messages, profiles, or reports when reasonably necessary for operations, legal compliance, trust and safety, or enforcement.",
          "Reporting, blocking, and moderation features may be offered to help maintain platform integrity, but we are not obligated to act on every report in a specific way or timeframe.",
        ],
      },
      {
        eyebrow: "6. Paid Features, Billing, and Refunds",
        title: "Subscriptions, credits, and purchase terms",
        description:
          "Certain features may require payment, subscription enrollment, or the purchase of credits, and additional commercial terms may apply at checkout.",
        points: [
          "Users agree to pay all fees, taxes, and charges associated with their selected plan, credit package, or paid feature.",
          "Subscriptions may renew automatically unless canceled in accordance with the billing terms presented at purchase.",
          "We may change pricing, packaging, feature access, or plan structure prospectively, but material billing changes should not be applied retroactively without notice where required.",
          "Except where required by law or expressly stated otherwise, fees are non-refundable once charged or once paid features have been consumed or activated.",
        ],
      },
      {
        eyebrow: "7. Suspension, Termination, and Service Changes",
        title: "When access may be limited or ended",
        description:
          "We may update, suspend, restrict, or discontinue parts of the service, and we may take action against accounts that create risk for the platform or its users.",
        points: [
          "We may modify, pause, or discontinue any feature, workflow, plan, or portion of the service at any time, with or without prior notice where permitted by law.",
          "We may investigate suspected misuse and suspend or terminate accounts for policy violations, safety concerns, legal risk, nonpayment, or abusive conduct.",
          "Users may stop using the service at any time and may request account closure, subject to payment obligations and retention requirements described in our policies.",
          "Termination or suspension does not limit any rights or remedies that accrued before the account was closed or access was restricted.",
        ],
      },
      {
        eyebrow: "8. Disclaimers and Liability Limits",
        title: "Important limits on warranties and responsibility",
        description:
          "The service is provided on an as-is and as-available basis, and users accept that some risks are inherent in online services and personal introductions.",
        points: [
          "To the maximum extent permitted by law, Luster disclaims warranties of merchantability, fitness for a particular purpose, non-infringement, accuracy, availability, and uninterrupted operation.",
          "We are not responsible for the conduct, identity, intent, statements, or actions of other users, whether online or offline.",
          "To the maximum extent permitted by law, Luster and its affiliates will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages arising out of or related to the service.",
          "To the maximum extent permitted by law, any aggregate liability of Luster arising out of these Terms or the service will not exceed the greater of the amount paid by the user to Luster in the 12 months before the claim or a minimal statutory fallback amount if required.",
        ],
      },
      {
        eyebrow: "9. General Legal Terms",
        title: "Disputes, governing law, and updates",
        description:
          "These final terms explain how changes, disputes, and general contract mechanics are handled.",
        points: [
          "These Terms should be governed by the laws specified in Luster's final operating jurisdiction, excluding conflict-of-law rules, and venue should be completed before launch with local legal review.",
          "If any provision of these Terms is found unenforceable, the remaining provisions will continue in full force to the extent permitted by law.",
          "Our failure to enforce a provision is not a waiver of that provision or any other right.",
          "We may update these Terms from time to time, and continued use of the service after the effective date of updated Terms constitutes acceptance of the revised version unless applicable law requires additional consent.",
        ],
      },
    ],
  },
  "contact-us": {
    eyebrow: "contact sample",
    title: "A support page that matches the product voice",
    description:
      "This sample contact page uses the same palette and spacing as the private profile experience so support content feels integrated rather than generic.",
    badgeLabel: "Support",
    badgeValue: "Response-friendly layout",
    statLabel: "Best for",
    statValue: "Billing, access, product questions, and feedback",
    sections: [
      {
        eyebrow: "Reach Out",
        title: "Guide users to the right support path",
        description:
          "Contact pages work best when they set expectations up front and reduce the amount of back-and-forth needed.",
        points: [
          "Direct billing questions to a dedicated support path.",
          "Use product feedback prompts to capture improvement ideas.",
          "Encourage users to include relevant account details for faster help.",
        ],
      },
      {
        eyebrow: "What To Include",
        title: "Make support requests easier to resolve",
        description:
          "Short checklists help users send complete information the first time, especially when the request relates to saved profiles or compatibility results.",
        points: [
          "Mention the account email or username.",
          "Note which page or feature triggered the issue.",
          "Include a concise summary of the expected behavior.",
        ],
      },
    ],
  },
};
