---
title: Privacy policy
lastUpdated: 2026-10-02
summary: Your atlas is stored in a private, per-account workspace on the Life Atlas service. AI features send limited content to Anthropic only when you choose an AI action. No ads, and your data is never sold.
---

## Account privacy

Life Atlas is operated by {{legalName}}. Each account has a separate private workspace. Users cannot see or change another account's atlas. Todoist integration and Todoist AI triage are restricted to the operator's primary workspace and are not available to other accounts.

## Information the app collects

Account information includes the email address you provide, an internal user identifier, a salted password hash, and hashed session credentials. Your readable password is not stored.

Atlas information you enter is sent to the Life Atlas API and stored in its database. This can include quest titles and descriptions, evidence labels and completion marks, quick-log text, role and arc status, ordering choices, and timeline entries.

Life Atlas does not request contacts, precise location, photos, camera, microphone, advertising ID, or payment details. The app does not serve ads. Crash monitoring is disabled unless {{legalName}} configures its monitoring service; if enabled, technical crash and performance diagnostics may be processed to keep the app reliable.

## On-demand AI features

Life Atlas uses Anthropic's commercial Claude API only after you deliberately choose an AI action. Nothing is sent to Anthropic automatically. Email addresses, passwords, password hashes, session credentials, and internal user identifiers are not included in AI requests.

When you tap **Generate** for an Operating Brief, Life Atlas may send selected chapter text, up to five active quest titles and related notes, system signals and risks, and up to three suggested next moves. Claude uses that content to return a short synthesis to the app. The brief is not added to the Life Atlas workspace database.

In the operator-only Todoist Triage feature, tapping **Run** may send up to 60 Todoist task titles, project names, and role hints together with relevant Atlas arcs and quests. The returned plan is stored in the operator's workspace for review and is not applied until the operator chooses to apply it. Other accounts cannot access this feature.

Anthropic states that commercial API inputs and outputs are not used to train its models by default and are deleted within 30 days by default, subject to its documented legal, safety, and service exceptions. Life Atlas limits how often AI can be invoked and treats all returned suggestions as untrusted until they pass app validation and user review.

## How information is used

The information is used only to provide app functionality: showing roles, arcs, quests, progress, evidence, timelines, and recommendations inside the account's private workspace and keeping that workspace separate from other users. {{legalName}} does not sell the data or use it for advertising, marketing profiles, or data-broker activity.

## Hosting and sharing

The app and API are hosted by Fly.io, which processes network requests and stored data on behalf of {{legalName}}. Anthropic processes the limited content described above to provide explicitly requested AI features. Data is transmitted over HTTPS in production. {{legalName}} does not sell information or share it with advertisers or data brokers.

## Retention and deletion

Account and atlas data is retained until the account is deleted or the service is retired. You can permanently delete the account and its associated Life Atlas data from the in-app account menu. You can also use the [account deletion page](/apps/life-atlas/delete-account). Active sessions are deleted with the account. Deleting the account does not make a prior AI request disappear from Anthropic immediately; Anthropic's limited API retention expires under the default period described above.

## Age and audience

Life Atlas is intended for adults aged 18 and over. It is not designed for children and does not knowingly collect children's information.

## Changes and contact

If this policy changes, the date above will be updated. Questions can be sent to [{{privacyEmail}}](mailto:{{privacyEmail}}).
