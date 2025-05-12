//motionPresets.ts

/**
 * Motion presets
 * ------------------------------------------------------------------
 * References
 * • Variants & keyframes ............ https://motion.dev/docs/react-animation#variants :contentReference[oaicite:0]{index=0}
 * • Transitions (duration/ease) ..... https://motion.dev/docs/react-transitions :contentReference[oaicite:1]{index=1}
 * • Stagger orchestration ........... https://motion.dev/docs/react-animation#orchestration :contentReference[oaicite:2]{index=2}
 */

import type { Variants } from "motion/react";

/* -------------------------------------------------------------------------- */
/*  Primitive variants                                                        */
/* -------------------------------------------------------------------------- */

/** Simple fade-in */
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

/** Slide-up + fade (good for captions/buttons) */
export const slideUp: Variants = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/* -------------------------------------------------------------------------- */
/*  Looping / keyframe variants                                               */
/* -------------------------------------------------------------------------- */

/**
 * Ken-Burns-style zoom that loops forever.
 * Mirrors Cloudinary’s e_zoompan default (≈6-8 s gentle zoom).
 */
export const zoomInOut: Variants = {
    rest: { scale: 1 },
    zoom: {
        scale: [1, 1.1, 1],                        // keyframes
        transition: {
            duration: 8,
            times: [0, 0.5, 1],
            ease: "easeInOut",
            repeat: Infinity,
        },
    },
};

/* -------------------------------------------------------------------------- */
/*  Orchestration helpers                                                     */
/* -------------------------------------------------------------------------- */

/** Apply to a parent to stagger its children on entry */
export const staggerContainer: Variants = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.3,
        },
    },
};
