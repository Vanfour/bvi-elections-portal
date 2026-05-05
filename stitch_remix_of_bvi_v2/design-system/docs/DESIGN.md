# Design System Documentation: Digital Sovereignty & The Sovereign Ledger

## 1. Overview & Creative North Star
The creative direction for this design system is titled **"The Sovereign Ledger."** 

In designing for the British Virgin Islands Department of Elections, we must transcend the "standard government portal" aesthetic. We are building a digital monument to democracy—one that feels as authoritative as a legal ledger yet as transparent and fluid as the Caribbean waters. 

This system moves beyond generic templates by utilizing **intentional asymmetry** and **tonal layering**. We reject the rigid, boxed-in layouts of the past in favor of an editorial experience where content breathes. By using high-contrast typography scales and overlapping surfaces, we create a signature visual identity that communicates absolute trust and modern efficiency.

---

### 2. Colors: The Palette of Authority
The color strategy is rooted in the BVI flag, utilizing deep blues for authority and a vibrant "Action" red for the most critical civic duties.

*   **Primary (`#00205B`):** Used for the bedrock of the UI—headers, primary buttons, and foundational type. This deep navy establishes the authoritative tone of the Sovereign Ledger.
*   **Secondary (`#E03C31`):** Reserved exclusively for high-priority calls to action, such as "Register to Vote." This color must be used sparingly to maintain its psychological impact.
*   **Tertiary (`#007A33`):** A lush green used for accents, positive status indicators, and highlights related to growth and renewal.
*   **Neutral (`#F8F9FA`):** A clean, professional base color for backgrounds and non-chromatic surfaces.
*   **The "No-Line" Rule:** We strictly prohibit the use of 1px solid borders to define sections. Layout boundaries must be established through background color shifts. For example, a `surface-container-low` section sitting against a `background` provides a sophisticated, seamless transition that feels "built-in" rather than "pasted-on."
*   **The "Glass & Gradient" Rule:** To provide a premium feel, floating navigation elements or top bars should utilize Glassmorphism—using `surface_container_lowest` with a 85% opacity and a `20px` backdrop blur.

---

### 3. Typography: Editorial Clarity
We pair the geometric authority of **Public Sans** with the technical precision of **Inter**.

*   **Display & Headline (Public Sans):** These are the "Voices of the State." Large, bold, and unapologetic. Use `display-lg` for landing hero statements to create an editorial, high-end feel.
*   **Title, Body & Label (Inter):** These are the "Voices of Information." Inter provides maximum legibility for complex electoral processes. The transition from a `headline-md` to a `body-lg` creates a clear, trustworthy hierarchy.
*   **Intentional Scale:** We utilize drastic jumps in scale (e.g., placing `label-sm` in all-caps directly above a `headline-lg`) to create an asymmetrical, modern layout that feels curated.

---

### 4. Elevation & Depth: Tonal Layering
We do not use shadows to create hierarchy; we use **Tonal Layering**.

*   **The Layering Principle:** Think of the UI as stacked sheets of fine stationery.
    *   **Level 0:** `background` (#F8F9FA) - The base canvas.
    *   **Level 1:** `surface_container_low` - Large content blocks or section backgrounds.
    *   **Level 2:** `surface_container_lowest` - High-priority cards or interaction containers.
*   **Corner Treatment:** With a roundedness setting of `2` (Moderate), all containers and buttons feature a balanced, professional curve that softens the authoritative color palette.
*   **The "Ghost Border" Fallback:** For input fields where containment is mandatory, use a "Ghost Border"—the `outline_variant` token at 15% opacity. Full-opacity borders are strictly forbidden.

---

### 5. Components: Precision Engineered

#### **Buttons**
*   **Primary (The Action):** Solid `primary` (#00205B) background with `on_primary` text. Uses moderate roundedness to feel approachable yet firm.
*   **Strategic Emphasis:** The "Register to Vote" button uses the `secondary` (#E03C31) red. It should be the only red element on the screen to ensure it acts as a magnetic North Star.
*   **Tertiary:** Ghost style with no background; uses `primary` text and an underline on hover.

#### **Cards & Lists**
*   **Rule:** Forbid divider lines. 
*   **Implementation:** Separate list items using `spacing` level 2 (Normal) and subtle background shifts. Cards should use `surface_container_lowest` against a `surface_container_low` background.

#### **Input Fields**
*   **Styling:** Generous internal padding and `surface_container_lowest` background. 
*   **State:** On focus, use a `primary` "Ghost Border" (20% opacity) and a subtle 2px inset glow to signal activity.

#### **Status Chips**
*   Used for "Election Status" (e.g., *Open*, *Closed*, *Counting*). These should use `tertiary_container` for positive states and `error_container` for alerts.

---

### 6. Do's and Don'ts

#### **Do:**
*   **Use Asymmetric Margins:** Allow more white space on the left or right of a container to create a modern, editorial rhythm.
*   **Embrace Breathing Room:** Utilize the standard `spacing` (Level 2) to ensure the UI feels balanced and not overcrowded.
*   **Check Contrast:** Ensure all text on `primary` or `secondary` backgrounds meets WCAG AAA standards for accessibility.

#### **Don't:**
*   **Don't use 1px Borders:** Never use a solid dark line to separate content. Use a background color change from the `surface_container` scale.
*   **Don't Over-Red:** Do not use the `secondary` red for icons, decorative lines, or minor accents. It is a color of *action*, not decoration.
*   **Don't Use Sharp Corners:** Every interactive element must adhere to the system roundedness (Level 2) to maintain a cohesive, modern visual language.