// Construct assessment (ECM module) — Stage 2 of the assessment.
//
// SAMPLE / PLACEHOLDER content. The FRD (FR-11/FR-11A) calls for 64
// validated scenarios (32 IT + 32 Education, 8 per dimension) authored and
// scored by the UVAA framework developer — that scoring key is the
// product's core IP and isn't in this repo. These 8 (2 per dimension, IT
// vertical flavour) exist so the assessment flow — navigation, scoring,
// results — is fully wired and testable end to end. Swap in the real
// scenario bank by replacing this file; scoring.js only depends on the
// shape below (dimension, options[].score).
//
// Per FR-19, option scores are 0–3 (3 = Sattva-aligned ... 0 = Tamas-
// aligned / shutdown) and are NOT tied to a fixed letter — score placement
// varies scenario to scenario, same as the real scoring key will.

export const DIMENSION_LABELS = {
  UPEKSHA: { name: 'Emotional Balance', sanskrit: 'Upeksha' },
  ANUVIGNA: { name: 'Pressure Non-Reactivity', sanskrit: 'Anuvigna' },
  ANASAKTI: { name: 'Detached Decision-Making', sanskrit: 'Anasakti' },
  VIVEKA: { name: 'Clarity in Complexity', sanskrit: 'Viveka' },
}

export const CONSTRUCT_SCENARIOS = [
  {
    id: 's1',
    dimension: 'UPEKSHA',
    situation: 'A client you worked hard to win chooses a competitor at the final stage.',
    options: [
      { key: 'A', text: 'Note it, look for what’s transferable, and move to the next opportunity.', score: 3 },
      { key: 'B', text: 'Feel it sting for a while and quietly lower your expectations for the next pitch.', score: 1 },
      { key: 'C', text: 'Ask for one more conversation to try to change their mind.', score: 2 },
      { key: 'D', text: 'Stop investing effort in prospects until you’re sure they’ll convert.', score: 0 },
    ],
  },
  {
    id: 's2',
    dimension: 'UPEKSHA',
    situation: 'A feature you championed gets cut from the roadmap after a leadership review.',
    options: [
      { key: 'A', text: 'Push back hard in the next planning meeting to get it reinstated.', score: 1 },
      { key: 'B', text: 'Accept the call, archive the work cleanly, and ask what’s next.', score: 3 },
      { key: 'C', text: 'Quietly keep building it on the side, unconvinced by the decision.', score: 0 },
      { key: 'D', text: 'Ask for the reasoning, note it, and let it go.', score: 2 },
    ],
  },
  {
    id: 's3',
    dimension: 'ANUVIGNA',
    situation: 'Production goes down during a client demo you’re running.',
    options: [
      { key: 'A', text: 'Pause, acknowledge it to the room, and work the problem methodically.', score: 3 },
      { key: 'B', text: 'Scramble visibly, apologising repeatedly while trying fixes at random.', score: 1 },
      { key: 'C', text: 'Freeze for a moment, then hand it off to someone else entirely.', score: 0 },
      { key: 'D', text: 'Stay calm outwardly but rush the fix without checking root cause.', score: 2 },
    ],
  },
  {
    id: 's4',
    dimension: 'ANUVIGNA',
    situation: 'You get a terse, urgent message from a senior stakeholder mid-sprint demanding an immediate call.',
    options: [
      { key: 'A', text: 'Reply immediately, dropping everything, visibly rattled on the call.', score: 1 },
      { key: 'B', text: 'Take a beat, gather context, then respond with a clear time to talk.', score: 3 },
      { key: 'C', text: 'Delay responding until the urgency passes on its own.', score: 0 },
      { key: 'D', text: 'Respond right away but stay measured on the call itself.', score: 2 },
    ],
  },
  {
    id: 's5',
    dimension: 'ANASAKTI',
    situation: 'A tool your team built in-house is clearly outperformed by a new vendor option.',
    options: [
      { key: 'A', text: 'Recommend switching, despite the time your team invested building it.', score: 3 },
      { key: 'B', text: 'Advocate for keeping the in-house tool since so much effort already went in.', score: 0 },
      { key: 'C', text: 'Suggest a slow transition, mostly to avoid the sunk-cost conversation.', score: 1 },
      { key: 'D', text: 'Compare both fairly, but lean toward keeping what’s familiar.', score: 2 },
    ],
  },
  {
    id: 's6',
    dimension: 'ANASAKTI',
    situation: 'Your original project plan no longer fits new information that’s come in.',
    options: [
      { key: 'A', text: 'Keep executing the original plan since it’s already approved and underway.', score: 0 },
      { key: 'B', text: 'Revise the plan to fit the new information, even though it means rework.', score: 3 },
      { key: 'C', text: 'Adjust a few details but largely stay the course.', score: 1 },
      { key: 'D', text: 'Flag the mismatch but wait for someone else to decide on a change.', score: 2 },
    ],
  },
  {
    id: 's7',
    dimension: 'VIVEKA',
    situation: 'Two credible teammates give you conflicting advice on how to proceed.',
    options: [
      { key: 'A', text: 'Pick whichever opinion came from the more senior person.', score: 1 },
      { key: 'B', text: 'Weigh both against the actual goal and decide on that basis.', score: 3 },
      { key: 'C', text: 'Delay deciding until a third opinion resolves the conflict.', score: 0 },
      { key: 'D', text: 'Blend both approaches without fully resolving the tension between them.', score: 2 },
    ],
  },
  {
    id: 's8',
    dimension: 'VIVEKA',
    situation: 'Requirements for a project remain genuinely ambiguous a week before a milestone.',
    options: [
      { key: 'A', text: 'Make a reasonable working assumption, state it clearly, and proceed.', score: 3 },
      { key: 'B', text: 'Wait for full clarity before doing any further work.', score: 0 },
      { key: 'C', text: 'Proceed on your best guess without flagging the assumption to anyone.', score: 1 },
      { key: 'D', text: 'Ask a clarifying question, then proceed cautiously once you get a partial answer.', score: 2 },
    ],
  },
]
