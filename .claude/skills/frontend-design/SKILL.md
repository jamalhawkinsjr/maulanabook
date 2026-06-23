---
name: frontend-design
description: Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults.
license: Complete terms in LICENSE.txt
---

# Frontend Design

Approach this as the design lead at a small studio known for giving every client a visual identity that could not be mistaken for anyone else's. This client has already rejected proposals that felt templated, and is paying for a distinctive point of view: make deliberate, opinionated choices about palette, typography, and layout that are specific to this brief, and take one real aesthetic risk you can justify.

## Ground it in the subject

If the brief does not pin down what the product or subject is, pin it yourself before designing: name one concrete subject, its audience, and the page's single job, and state your choice. If there's any information in your memory about the human's preferences, context about what they're building, or designs you've made before – use that as a hint. The subject's own world, its materials, instruments, artifacts, and vernacular, is where distinctive choices come from. Build with the brief's real content and subject matter throughout.

## Design principles

For web designs, the hero is a thesis. Open with the most characteristic thing in the subject's world, in whatever form makes sense for it: a headline, an image, an animation, a live demo, an interactive moment. Be deliberate with your choice: a big number with a small label, supporting stats, and a gradient accent is the template answer, only use if that's truly the best option.

Typography carries the personality of the page. Pair the display and body faces deliberately, not the same families you would reach for on any other project, and set a clear type scale with intentional weights, widths, and spacing. Make the type treatment itself a memorable part of the design, not a neutral delivery vehicle for the content.

Structure is information. Structural devices, numbering, eyebrows, dividers, labels, should encode something true about the content, not decorate it. Many generic designs use numbered markers (01 / 02 / 03), but that's only appropriate if the content actually is a sequence - like a real process or a typed timeline where order carries information the reader needs. Question if choices like numbered markers actually make sense before incorporating them.

Leverage motion deliberately. Think about where and if animation can serve the subject: a page-load sequence, a scroll-triggered reveal, hover micro-interactions, ambient atmosphere. An orchestrated moment usually lands harder than scattered effects; choose what the direction calls for. However, sometimes less is more, and extra animation contributes to the feeling that the design is AI-generated.

Match complexity to the vision. Maximalist directions need elaborate execution; minimal directions need precision in spacing, type, and detail. Elegance is executing the chosen vision well.

Consider written content carefully. Often a design brief may not contain real content, and it's up to you to come up with copy. Copy can make a design feel as templated as the design itself. See the below section on writing for more guidance.

## Process: brainstorm, explore, plan, critique, build, critique again

For calibration: AI-generated design right now clusters around three looks: (1) a warm cream background (near #F4F1EA) with a high-contrast serif display and a terracotta accent; (2) a near-black background with a single bright acid-green or vermilion accent; (3) a broadsheet-style layout with hairline rules, zero border-radius, and dense newspaper-like columns. All three are legitimate for some briefs, but defaulting to them is a tell. Identify which look your design resembles and, if there's no strong reason it should, pivot.

Before writing any code:

1. **Brainstorm** – List 3–5 directions for the palette, type pairing, and hero treatment. Make them genuinely different from one another.
2. **Explore** – For each direction, write one sentence naming the look's reference point and the aesthetic risk.
3. **Plan** – Pick one direction. Write out the full design system: background, surface, text, accent colors (with hex values); display and body typefaces (with specific weights and sizes for H1, H2, body, caption); hero concept; and the one aesthetic risk you're committing to. State your rationale in 2–3 sentences.
4. **Critique** – Before building, stress-test your plan: Does it feel templated? Does it serve the subject's world? Is the aesthetic risk actually risky, or is it a safe choice in disguise?
5. **Build** – Execute with precision. Implement the design system you planned; don't drift back to defaults.
6. **Critique again** – After building, evaluate: Does the design look like it could have been made for a different client? If yes, identify what is generic and fix it.

## Writing

Copy is part of the design. Here is how to make it non-generic:

- **Headlines**: Avoid the subject + generic verb formula ("Empowering your workflow", "Transforming the way you work"). Write from inside the subject's world: use its vocabulary, its rhythm, its insider perspective.
- **Supporting text**: One specific claim beats three vague ones. If you're writing about a product, name something concrete it does; if it's a portfolio, name something specific the person has done.
- **Labels and UI text**: Should sound like a person who lives in this subject's world wrote them, not a product manager who learned the category last week.
- **Avoid**: "Seamless", "powerful", "next-generation", "innovative", "cutting-edge", "unlock", "elevate", "revolutionize", and similar terms that have lost meaning through overuse.

## Technical standards

Every implementation should:

- Load custom typefaces from Google Fonts or equivalent (never rely on system fonts for the display face)
- Set `font-display: swap` and load only weights actually used
- Build mobile-first with a max-width container and fluid type scale
- Use CSS custom properties for the entire color and type system so it can be adjusted in one place
- Keep motion behind `prefers-reduced-motion` media query
- Meet WCAG AA contrast for all body text (4.5:1 minimum)
- Use semantic HTML: one `<h1>` per page, landmark regions, descriptive link text

## Deliverable

A single self-contained HTML file (or the project's standard file format) that a browser can open directly, with all CSS inlined or in a `<style>` block. No build step required for review unless the project already uses one.
