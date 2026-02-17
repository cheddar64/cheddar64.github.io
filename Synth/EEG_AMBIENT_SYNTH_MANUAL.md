# EEG AMBIENT SYNTH

### Generative Brainwave Soundscapes | Product Manual v1.0.0

---

## Table of Contents

1. [Introduction](#introduction)
2. [Vision & Mission](#vision--mission)
3. [The Science Behind It](#the-science-behind-it)
4. [System Architecture](#system-architecture)
5. [Getting Started](#getting-started)
6. [Interface Guide](#interface-guide)
7. [Synthesis Engine](#synthesis-engine)
8. [Effects Chain](#effects-chain)
9. [EEG Sample Library](#eeg-sample-library)
10. [Chord Generator](#chord-generator)
11. [Visualizations](#visualizations)
12. [Parameter Reference](#parameter-reference)
13. [Signal Flow Diagram](#signal-flow-diagram)
14. [Technical Specifications](#technical-specifications)
15. [Roadmap](#roadmap)

---

## Introduction

EEG Ambient Synth is a web-based generative ambient synthesizer that transforms brainwave data into evolving, immersive soundscapes in real-time. It bridges the gap between neuroscience and music by mapping the electrical rhythms of the human brain directly onto a multi-layered synthesis engine with professional-grade effects processing.

Unlike conventional synthesizers that rely on manual knob-turning or pre-programmed sequences, EEG Ambient Synth is *autonomous*. The user selects a brain state, presses play, and the synthesizer composes itself --- continuously reading simulated EEG data, extracting spectral features, and routing those features into every parameter of the sound engine. The result is music that *thinks* --- ambient textures that breathe, shift, and evolve exactly as a human brain would.

The instrument ships with a library of 60 scientifically-modeled EEG patterns spanning six categories: classic resting states, sleep stages, meditation practices, cognitive tasks, emotional states, and dynamic transitions. Each pattern produces a genuinely distinct sonic experience, from the deep rumbling drones of N3 deep sleep to the tense, jagged textures of an anxiety response to the serene coherence of transcendental meditation.

The entire system runs in the browser with zero dependencies on external audio libraries. Every oscillator, filter, delay line, and reverb tap is built from scratch on the Web Audio API --- the same low-level audio framework used by professional web audio applications. The interface draws inspiration from iconic 2000s-era VST plugins like Toxic BioHazard, Absynth, and Cthulhu, combining dark cyberpunk aesthetics with functional, information-dense panels.

---

## Vision & Mission

### The Problem

Ambient music production has always required deep technical skill. Crafting evolving soundscapes demands expertise in synthesis, effects routing, automation, and musical theory. At the same time, there is a growing body of neuroscience research demonstrating measurable, distinct brainwave signatures for different mental states --- yet this data has remained locked in clinical and academic contexts, disconnected from creative tools.

Meanwhile, the wellness, meditation, and biofeedback industries are rapidly expanding. Consumers are increasingly interested in personalized, responsive audio experiences --- sound that adapts to *them* rather than playing a static recording.

### The Vision

EEG Ambient Synth exists at the intersection of three converging fields:

**Generative music** --- sound that composes itself according to rules and data, never repeating, always evolving.

**Neuroscience** --- the rich, measurable electrical signatures of the human brain, mapped across decades of EEG research into well-understood frequency bands (delta, theta, alpha, beta, gamma) and complex metrics (coherence, burst intensity, spectral complexity).

**Accessible synthesis** --- professional-quality audio generation running entirely in the browser, requiring no plugins, no DAW, no downloads, and no prior audio knowledge.

Our mission is to make the brain audible. We are building a platform where brainwave data --- whether synthetic, recorded, or streamed live from consumer EEG hardware --- becomes the primary control surface for rich, evolving ambient music. Every mental state has a sound. Every thought pattern becomes a texture. Every transition between states becomes a musical journey.

### Where We Are Going

The current release (v1.0.0) uses synthetic EEG data modeled on published neuroscience literature. The architecture is designed from the ground up for a second phase: **live hardware integration** with consumer EEG headsets (Muse 2, Muse S, OpenBCI). When connected to a live brain, the synthesizer will generate music in real-time from the user's own neural activity --- creating a truly personalized, biofeedback-driven audio experience.

The applications extend far beyond music production:

- **Meditation and mindfulness** --- audible feedback on meditative depth, with the sound itself guiding the user toward target brain states
- **Sleep assistance** --- soundscapes that adapt to the user's sleep stage, deepening as they descend into N3 and quieting during REM
- **Therapeutic contexts** --- neurofeedback training where patients learn to modulate their own brain activity by hearing it reflected in sound
- **Live performance** --- brain-controlled ambient music for installations, concerts, and immersive experiences
- **Research** --- an open, accessible platform for exploring the sonification of neural data

---

## The Science Behind It

### What is EEG?

Electroencephalography (EEG) measures the electrical activity of the brain using sensors placed on the scalp. Billions of neurons fire in coordinated rhythmic patterns, producing oscillations at different frequencies. These oscillations are grouped into well-established frequency bands, each associated with distinct cognitive and physiological states:

| Band | Frequency Range | Associated States |
|------|----------------|-------------------|
| **Delta** | 0.5 -- 4 Hz | Deep sleep, unconscious processes, healing |
| **Theta** | 4 -- 8 Hz | Meditation, drowsiness, memory encoding, creativity |
| **Alpha** | 8 -- 13 Hz | Relaxed wakefulness, eyes closed, calm awareness |
| **Beta** | 13 -- 30 Hz | Active thinking, concentration, problem-solving |
| **Gamma** | 30 -- 100 Hz | Higher cognition, perception binding, peak awareness |

These bands do not operate in isolation. A relaxed person with closed eyes will show dominant alpha with moderate theta. An anxious person will show high beta with suppressed alpha. A meditating monk may show extraordinary theta-alpha coherence. It is the *ratio* and *dynamics* of these bands that define a mental state.

### Beyond Simple Bands

EEG Ambient Synth extracts 12 distinct features from the brainwave signal, going far beyond simple band power:

| Feature | What It Measures | What It Controls |
|---------|-----------------|-----------------|
| **Delta** | Slow wave amplitude (deep processes) | Sub Bass layer volume, reverb depth |
| **Theta** | Mid-slow amplitude (meditation/memory) | Pad 1 volume, delay feedback |
| **Alpha** | Mid-frequency amplitude (relaxed awareness) | Pad 2 volume, filter brightness |
| **Beta** | Fast amplitude (active cognition) | Pad 3 volume, filter brightness |
| **Gamma** | Very fast amplitude (peak processing) | Accent layer volume, filter resonance |
| **Complexity** | Spectral richness of the signal | Texture layer volume, resonance |
| **Total Power** | Overall brain activity level | Displayed as a monitoring metric |
| **Burst Intensity** | Sudden spikes in neural activity | Distortion drive |
| **Coherence** | Signal synchronization / alignment | Chorus depth |
| **Microvariability** | Short-term signal jitter | Chorus LFO speed |
| **Rate of Change** | Overall signal volatility | Available for future routing |
| **Asymmetry** | Left-right brain imbalance (skewness) | Available for future routing |

This means the synthesizer does not simply get "louder when there's more brain activity." It responds to the *character* of the brain activity --- whether the signal is smooth or jagged, synchronized or chaotic, stable or bursting.

### Synthetic EEG Generation

The v1.0.0 sample library uses a parametric generation engine that models realistic EEG characteristics:

- **Multi-frequency oscillators**: Each band contains 3 sinusoidal components at physiologically accurate frequencies (e.g., delta uses 1.5, 2.5, and 3.5 Hz), producing complex, beating waveforms rather than sterile single-frequency tones.
- **Pink noise floor**: A Voss-McCartney pink noise generator provides the naturalistic 1/f spectral slope characteristic of real biological signals.
- **Time-varying envelopes**: Smooth random envelopes modulate each band's amplitude independently over the 120-second recording, so the signal is never static.
- **Evolution keyframes**: Each sample defines how its band amplitudes shift across the recording (e.g., the "Sleep to Wake Transition" sample gradually reduces delta while increasing alpha over 2 minutes).
- **Burst events**: Configurable probability of sudden transient spikes, modeling phenomena like K-complexes during sleep or startle responses.
- **Seeded determinism**: Every sample uses a unique random seed, ensuring identical results on every playback while maintaining distinct character between samples.

---

## System Architecture

### Technology

EEG Ambient Synth is built entirely on modern web standards:

| Component | Technology | Purpose |
|-----------|-----------|---------|
| UI Framework | React 19 | Component-based interface |
| Build System | Vite 7 | Fast development and optimized production builds |
| Styling | Tailwind CSS 4 + Custom CSS | VST-inspired design system |
| Audio Engine | Web Audio API (native) | All synthesis, effects, and analysis |
| State Management | React hooks (useState, useCallback) | Reactive UI updates |
| Animation | requestAnimationFrame | 60fps visualizations and parameter updates |

**No external audio libraries are used.** Every oscillator, filter, gain node, delay line, waveshaper, and analyser is constructed directly from Web Audio API primitives. This ensures minimal bundle size, maximum performance, and zero supply-chain risk.

### Module Organization

```
src/
  audio/
    AudioEngine.js      Core audio context, effects routing, synthesis control
    SynthLayer.js       Individual voice with 5 detuned oscillators + filter
    ChordPlayer.js      Random chord generation with ambient envelopes
    effects.js          Distortion curve utility
  eeg/
    generator.js        60-sample parametric EEG generation engine
    features.js         Real-time feature extraction (12 metrics)
    constants.js        Sample metadata, scale notes, layer configs
  components/
    App.jsx             Main orchestrator and state management
    Controls.jsx        Transport (play/stop/reset/time)
    SampleSelector.jsx  60-sample grouped dropdown with descriptions
    IntensityControl.jsx  EEG response sensitivity slider
    ChordButton.jsx     Random chord trigger
    WaveformCanvas.jsx  Raw EEG signal visualization
    SpectrumAnalyzer.jsx  Real-time frequency spectrum
    EEGFeatures.jsx     Band power meters
    SynthLayers.jsx     Voice activity LED monitor
    Parameters.jsx      Live parameter readouts
    InfoTooltip.jsx     Contextual help system
  hooks/
    useAudioEngine.js   React interface to the audio singleton
    useAnimationFrame.js  RAF lifecycle management
```

---

## Getting Started

### Installation

```bash
# Clone or download the project
git clone <repository-url>
cd eeg-ambient-synth

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

Open the URL shown in your terminal (typically `http://localhost:5173`).

### Your First Soundscape (5-Step Quick Start)

**Step 1: Choose a Brain State**

In the **Sample Select** panel (top left), open the dropdown. You will see 60 EEG patterns organized into 6 categories. Start with something from **Classic States** --- try "Relaxed, Eyes Closed" for a warm, alpha-dominant ambient wash, or "Deep Sleep (N3)" for deep, rumbling delta drones.

A description of the selected state appears below the dropdown, explaining what brain activity it simulates and what kind of sound to expect.

**Step 2: Press Play**

Click the **Play** button in the **Transport** panel (top right). The synthesizer immediately begins reading the EEG data and generating sound. You will see:

- The **EEG Signal** waveform begin scrolling with a magenta playhead
- The **Spectrum Analyzer** light up with colored frequency bands
- The **EEG Bands** meters start showing band power percentages
- The **Synthesis Layers** LEDs illuminate as voices activate
- The **Parameters** panel show real-time filter, delay, reverb, and distortion values

**Step 3: Adjust Intensity**

The **Intensity** slider (below Sample Select) controls how strongly the synthesizer responds to the EEG data. At 100%, every nuance of the brainwave signal drives the sound. At lower values, the response is dampened, producing subtler changes. Start at 70% and adjust to taste.

**Step 4: Trigger Chords**

While the generative soundscape plays, click the **Chord** button in the **Chord Generator** panel to layer a random musical chord on top. Each click plays a different chord (from 11 types across 12 keys) with a lush, slow-attack ambient envelope that blends with the ongoing synthesis.

**Step 5: Explore Different States**

Switch between EEG samples while playing. Try jumping from "Serenity" (smooth, alpha-dominant calm) to "Fear" (tense, beta-heavy with burst transients) to "Caffeine Onset" (a 2-minute journey from drowsy theta to alert beta). Each sample produces a genuinely distinct sonic experience because the underlying EEG data --- and therefore every synthesis parameter --- is fundamentally different.

### Controls Reference

| Control | Function |
|---------|----------|
| **Play** | Start synthesis from current position |
| **Stop** | Immediately silence all voices and effects |
| **Reset** | Stop and return to the beginning (0.0s) |
| **Time display** | Shows elapsed position in the 120-second recording |
| **Sample dropdown** | Select from 60 EEG patterns across 6 categories |
| **Intensity slider** | 0--100% EEG response sensitivity |
| **Chord button** | Trigger a random ambient chord |
| **Waveform scroll** | Mouse wheel or pinch to zoom (0.5x -- 5.0x) |

### Contextual Help

Small **i** icons appear next to most labels throughout the interface. Hover over any of them (or tap on mobile) to see a tooltip explaining what that element does, what EEG band controls it, and how it affects the sound.

---

## Interface Guide

The interface is organized as a single VST-style frame with distinct functional regions:

### Header

The top bar displays the product name (**EEG Ambient Synth**), the tagline ("Pure Brain Mode --- Generative Soundscapes"), and the version number. The gradient styling and Orbitron typography establish the 2000s VST aesthetic carried throughout the interface.

### Top Row: Sample Select + Transport

**Sample Select** (left) contains the EEG pattern dropdown grouped into six categories (Classic States, Sleep Stages, Meditation, Cognitive, Emotional, Dynamic) with a description panel below. **Transport** (right) provides Play, Stop, and Reset controls alongside the elapsed time display.

### Second Row: Intensity + Chord Generator

**Intensity** (left) is a horizontal slider controlling how aggressively the synthesizer tracks the EEG data. **Chord Generator** (right) triggers random chords and displays the most recently played chord name.

### Waveform Display

A full-width canvas showing the raw EEG voltage waveform. A green trace shows brain electrical activity. A magenta vertical line marks the current playback position. The display supports zoom from 0.5x to 5.0x via scroll wheel or pinch gesture. Grid lines provide visual reference.

### Spectrum Analyzer

A full-width frequency spectrum display showing the real-time audio output. The visualization uses a continuous color gradient mapped to frequency ranges:

| Color | Frequency Range | Band |
|-------|----------------|------|
| Red | 20 -- 60 Hz | Sub |
| Cyan | 60 -- 200 Hz | Bass |
| Blue | 200 -- 600 Hz | Low-Mid |
| Green | 600 Hz -- 2 kHz | Mid |
| Yellow | 2 -- 6 kHz | High-Mid |
| Purple | 6 -- 20 kHz | High |

The filled area beneath the line uses vertical gradients for depth. Peaks above a threshold value emit a glow effect. The analyzer uses logarithmic frequency scaling with smoothing (30% attack, 92% decay) for natural motion.

### Bottom Row: EEG Features + Synth Layers + Parameters

Three panels side by side:

**EEG Bands** --- Six horizontal meters showing the current power in each frequency band (Delta, Theta, Alpha, Beta, Gamma) plus Complexity. Bars glow when values exceed 50%. Each meter is color-coded to its corresponding band.

**Synthesis Layers** --- Six rows, each with an LED indicator, layer name, volume bar, and percentage readout. LEDs illuminate with the layer's signature color when volume exceeds 1%. The six layers are Sub Bass, Pad 1 (Deep), Pad 2 (Mid), Pad 3 (High), Texture, and Accent.

**Parameters** --- Real-time readouts of the synthesis parameters currently being modulated by EEG data: Filter Cutoff (Hz), Resonance (Q), Total Power (%), and four effect amounts --- Delay Feedback, Distortion, Chorus, and Reverb --- each with colored accent borders and animated meter bars.

---

## Synthesis Engine

### Layer Architecture

The synthesis engine comprises **6 independent voices**, each targeting a different frequency register and controlled by a different EEG band. Every voice consists of:

- **5 detuned oscillators** --- spread across ± the configured detune range in cents, producing a naturally rich, chorus-like timbre without requiring a separate chorus effect
- **Lowpass filter** --- per-voice biquad filter with configurable cutoff and resonance, shared across all oscillators in the layer
- **Amplitude envelope** --- smooth gain ramping with configurable attack and release times, preventing clicks and creating the characteristic slow-swell ambient sound

#### Layer Specifications

| Layer | Base Freq | Waveform | Detune | Attack | Release | EEG Control |
|-------|-----------|----------|--------|--------|---------|-------------|
| Sub Bass | 55 Hz | Sine | ±5 ct | 2.5s | 3.0s | Delta × 0.6 |
| Pad 1 (Deep) | 110 Hz | Triangle | ±10 ct | 2.0s | 2.5s | Theta × 0.7 |
| Pad 2 (Mid) | 220 Hz | Sawtooth | ±12 ct | 1.8s | 2.0s | Alpha × 0.8 |
| Pad 3 (High) | 440 Hz | Sine | ±8 ct | 1.5s | 1.8s | Beta × 0.65 |
| Texture | 330 Hz | Square | ±18 ct | 1.0s | 1.5s | Complexity × 0.5 |
| Accent | 880 Hz | Triangle | ±6 ct | 0.8s | 1.2s | Gamma × 0.45 |

### Pitch Control

Three of the six layers (Pad 1, Pad 2, Pad 3) receive dynamic pitch updates based on EEG feature values. Frequencies are selected from a musically curated scale:

**Scale:** A minor pentatonic extended --- 220, 246.94, 261.63, 293.66, 329.63, 349.23, 392, 440 Hz

Pitch changes use **exponential frequency ramping** with a 0.8-second glide time, creating smooth portamento transitions rather than abrupt pitch jumps.

### Filter Modulation

All six layers share a global filter modulation driven by two EEG bands:

```
Cutoff = 300 + (Alpha × 5000) + (Beta × 2000) Hz
Resonance = 0.5 + (Gamma × 6) + (Complexity × 3)
```

This means relaxed states (high alpha) produce bright, open timbres, while low-alpha states produce darker, more muffled sounds. High gamma and complexity values introduce a resonant, vocal quality to the filter.

### Volume Mapping

Each layer's volume is the product of its controlling EEG band value, a per-layer sensitivity coefficient, and the global intensity setting. The intensity slider acts as a master sensitivity control --- at lower values, the synthesizer responds more gently to brain activity changes.

---

## Effects Chain

The audio signal passes through four parallel effects processors after the master gain stage. Each effect is modulated in real-time by a different EEG-derived metric, creating a direct mapping between brain state characteristics and sonic texture.

### Delay

A tempo-free echo effect that creates spatial depth.

| Parameter | Value | Modulation |
|-----------|-------|------------|
| Delay time | 375 ms | Static |
| Max feedback | 0.65 | Theta: 0.2 + Theta × 0.45 |
| Feedback filter | Lowpass 2500 Hz | Alpha: 1500 + (1-Alpha) × 3000 Hz |
| Dry/wet mix | 0.15 -- 0.50 | Theta: 0.15 + Theta × 0.35 |

**Why Theta?** Theta waves are associated with meditation, drowsiness, and dream-like states. The delay effect mirrors this by creating echoing, reverberant spaces --- the deeper the meditative state, the longer the echoes persist and the warmer (darker) they become.

### Reverb

A multi-tap delay network simulating room and hall acoustics.

| Parameter | Value | Modulation |
|-----------|-------|------------|
| Tap times | 29, 37, 43, 53 ms | Static |
| Tap gain | 0.15 each | Static |
| Master gain | 0.4 | Static |
| Wet amount | 0.25 -- 0.75 | Delta: 0.25 + Delta × 0.5 |

**Why Delta?** Delta waves dominate during deep sleep --- the most unconscious, expansive state. The reverb maps this by creating vast acoustic spaces during high-delta activity, as if the sound is echoing through a cathedral of the sleeping mind.

### Distortion

A waveshaper that adds harmonic overtones and grit.

| Parameter | Value | Modulation |
|-----------|-------|------------|
| Curve | 50-point arctangent | Static |
| Oversampling | 4x | Static |
| Drive amount | 0.0 -- 0.35 | Burst Intensity × Intensity |

**Why Burst Intensity?** Burst intensity measures sudden spikes in neural activity --- moments of sharp, unexpected brain response. The distortion effect mirrors this by adding grit and edge precisely when the brain signal becomes volatile, creating tense, textured moments in the soundscape.

### Chorus

A modulated delay that creates width and movement.

| Parameter | Value | Modulation |
|-----------|-------|------------|
| Base delay | 25 ms | Static |
| LFO depth | ±4 ms | Static |
| LFO rate | 0.2 -- 2.7 Hz | Microvariability |
| Wet amount | 0.0 -- 0.3 | Coherence × Intensity |

**Why Coherence and Microvariability?** Coherence measures how synchronized the EEG signal is --- high coherence means the brain is operating in an organized, aligned pattern. The chorus effect becomes more prominent during coherent states, adding a shimmering, unified quality. Microvariability controls the speed of the chorus modulation --- jittery, unstable signals produce faster, more anxious movement.

---

## EEG Sample Library

### Overview

The v1.0.0 library contains **60 unique EEG patterns** organized into six categories. Each pattern is a 120-second recording at 256 Hz sample rate (30,720 data points), generated deterministically from a unique random seed.

### Categories

#### Classic States (Samples 0--9)

The foundational brain states most commonly studied in neuroscience. These provide the broadest range of sonic character.

| # | Name | Dominant Bands | Sonic Character |
|---|------|---------------|-----------------|
| 0 | Relaxed, Eyes Closed | Alpha | Bright, open, warm pads with gentle movement |
| 1 | Deep Sleep (N3) | Delta | Deep, rumbling sub-bass drones |
| 2 | Focused Work | Beta | Active, buzzing mid-high textures with energy |
| 3 | Drowsy / Pre-Sleep | Theta | Warm, dreamy, slowly darkening |
| 4 | Anxious / Stressed | Beta + Gamma | Tense, jagged, unpredictable with burst events |
| 5 | Creative Flow | Theta + Alpha | Evolving, exploratory, balanced |
| 6 | Hyper-Alert | Gamma + Beta | Bright, intense, electrically charged |
| 7 | Mind Wandering | Mixed (drifting) | Shifting, unpredictable, never settling |
| 8 | Calm Attention | Balanced | Harmonious, stable, centered |
| 9 | Excited / Aroused | Beta + Gamma | Energetic, dynamic, intense |

#### Sleep Stages (Samples 10--19)

A journey through the architecture of sleep, from initial drowsiness to deep N3, REM dreaming, and the return to wakefulness.

| # | Name | Description |
|---|------|-------------|
| 10 | N1 Light Sleep | Alpha fades, theta emerges --- the edge of sleep |
| 11 | N2 Sleep Spindles | Brief rhythmic burst events punctuate quiet background |
| 12 | N3 Deep Sleep (Heavy) | Extreme delta dominance --- deep, heavy, slow |
| 13 | REM Sleep | Dream-like mixed frequencies with instability |
| 14 | Sleep to Wake Transition | Delta retreats as alpha and beta slowly emerge |
| 15 | Hypnagogic Imagery | Vivid theta-alpha creating hallucinatory textures |
| 16 | N2 K-Complex | Sharp transient spikes interrupt sleep baseline |
| 17 | Microsleep Episodes | Rapid theta/beta alternation --- jolts of sleep |
| 18 | Lucid Dream | Mixed activity with gamma awareness bursts |
| 19 | Sleep Deprived | Theta bleeding into waking, noisy, unstable |

#### Meditation (Samples 20--29)

Ten distinct meditation practices, each with a characteristic EEG signature. These samples demonstrate the wide variety of brain states achievable through contemplative practice.

| # | Name | Description |
|---|------|-------------|
| 20 | Beginner Meditation | Fluctuating alpha as concentration wavers |
| 21 | Deep Meditation | Strong theta-alpha immersion |
| 22 | Zen Meditation | Very strong theta, deep unwavering stillness |
| 23 | Yoga Nidra | Theta-dominant, hovering between sleep and wake |
| 24 | Progressive Relaxation | Alpha builds gradually as beta retreats |
| 25 | Mindfulness | Stable alpha, clear consistent attention |
| 26 | Transcendental | Very high smooth alpha, pure coherence |
| 27 | Body Scan | Alpha shifts subtly as awareness moves |
| 28 | Breath Focus | Rhythmic theta modulation synced to breathing |
| 29 | Open Awareness | Balanced alpha with subtle gamma openness |

#### Cognitive Tasks (Samples 30--39)

Brain patterns associated with specific mental activities. These demonstrate how different types of thinking produce distinct acoustic signatures.

| # | Name | Description |
|---|------|-------------|
| 30 | Math Problems | Frontal beta with theta for working memory |
| 31 | Reading | Sustained beta, steady concentration |
| 32 | Spatial Reasoning | Alpha-theta mix with moderate beta |
| 33 | Memory Recall | Theta bursts during retrieval attempts |
| 34 | Language Processing | Beta-gamma rapid linguistic computation |
| 35 | Music Listening | Alpha-theta emotional absorption |
| 36 | Decision Making | Theta/beta alternation (intuition vs. analysis) |
| 37 | Motor Planning | Alpha dips during prep, beta surges during execution |
| 38 | Visual Imagery | Alpha suppresses, beta rises during visualization |
| 39 | Learning New Task | Theta-gamma coupling for neural encoding |

#### Emotional States (Samples 40--49)

The neural signatures of ten distinct emotions, each producing a characteristic acoustic atmosphere.

| # | Name | Description |
|---|------|-------------|
| 40 | Joy | Warm, uplifting alpha with moderate beta |
| 41 | Sadness | Heavy, introspective theta-alpha drift |
| 42 | Fear | Tense, jarring beta with burst transients |
| 43 | Anger | Aggressive beta-gamma surge with chaotic bursts |
| 44 | Surprise | Sharp spike followed by gradual settling |
| 45 | Disgust | Uncomfortable rising theta, suppressed alpha |
| 46 | Awe / Wonder | Expansive alpha-theta with gamma bursts |
| 47 | Nostalgia | Warm, bittersweet theta-alpha blend |
| 48 | Serenity | Effortlessly peaceful, smooth high alpha |
| 49 | Anticipation | Mounting beta-gamma tension and excitement |

#### Dynamic / Transitional (Samples 50--59)

These samples demonstrate state *transitions* rather than static states. The brain activity evolves dramatically over the 120-second recording, producing soundscapes that tell a story.

| # | Name | Description |
|---|------|-------------|
| 50 | Gradual Relaxation | Active beta fades into calm alpha over 2 minutes |
| 51 | Stress Building | Peaceful alpha erodes as beta/gamma intensify |
| 52 | Caffeine Onset | Drowsy theta transforms into alert beta |
| 53 | Fatigue Onset | Alert beta yields to heavy theta |
| 54 | Task Switching | Rapid alternation between focus and rest |
| 55 | Rhythmic Attention | Wave-like alpha/beta oscillation |
| 56 | Startle to Recovery | Massive spike then slow baseline return |
| 57 | Habituation | All activity gradually diminishes |
| 58 | ADHD-Like | High theta/beta ratio with erratic shifts |
| 59 | Flow State Entry | Focused beta transitions into theta-alpha flow |

---

## Chord Generator

The Chord Generator adds harmonic color on demand. Inspired by the chord randomization features of the Cthulhu VST plugin, it generates a random musical chord each time the button is clicked.

### How It Works

1. A **random root note** is selected from the 12 chromatic pitches (C through B)
2. A **random octave** is chosen (octave 3 or 4, i.e., 130--523 Hz range)
3. A **random chord type** is selected from 11 voicings:

| Chord Type | Intervals (semitones) | Character |
|------------|----------------------|-----------|
| Major | 0, 4, 7 | Bright, resolved |
| Minor | 0, 3, 7 | Dark, melancholic |
| Maj7 | 0, 4, 7, 11 | Warm, jazzy |
| Min7 | 0, 3, 7, 10 | Smooth, introspective |
| Dom7 | 0, 4, 7, 10 | Tense, bluesy |
| Diminished | 0, 3, 6 | Unsettled, anxious |
| Augmented | 0, 4, 8 | Dreamy, floating |
| Sus2 | 0, 2, 7 | Open, ambiguous |
| Sus4 | 0, 5, 7 | Suspended, yearning |
| Add9 | 0, 4, 7, 14 | Lush, extended |
| Min9 | 0, 3, 7, 10, 14 | Rich, atmospheric |

### Chord Voicing

Each note in the chord is rendered with **2 detuned oscillators** (±6 cents) alternating between sine and triangle waveforms. Every note passes through its own lowpass filter (randomized around 2000 Hz). The amplitude envelope provides a slow, ambient swell:

- **Attack**: 0.3 seconds (fade in)
- **Sustain**: 1.5 seconds (gentle decay)
- **Release**: 4.0 seconds (long tail)
- **Total duration**: ~4.5 seconds per chord

Chords can be triggered at any time --- during playback or while stopped --- and blend naturally with the ongoing generative soundscape.

---

## Visualizations

### EEG Waveform Display

The waveform canvas renders the raw EEG voltage signal as a continuous green trace on a dark background. Key features:

- **Playback indicator**: A glowing magenta vertical line shows the current read position
- **Grid overlay**: 5 horizontal and 10 vertical reference lines
- **Zoom**: Scroll wheel (or pinch on touch devices) adjusts from 0.5x to 5.0x magnification
- **Glow effect**: The waveform trace has a neon glow (shadowBlur) for the VST aesthetic
- **Window**: Displays a 512-sample window (at 1.0x zoom), centered on the playhead

### Spectrum Analyzer

A professional-style frequency analyzer showing the real-time audio output:

- **256 frequency points** with logarithmic scaling (emphasizing lower frequencies where most musical content lives)
- **Continuous color gradient**: Each frequency band gets a distinct color from red (sub-bass) through cyan, blue, green, yellow to purple (high frequencies)
- **Filled area rendering**: Vertical gradients beneath the spectrum line create depth
- **Peak glow**: Frequencies above a threshold value emit a colored glow effect
- **Smoothing**: Fast attack (70%) and slow decay (8%) create natural, responsive motion
- **Frequency labels**: 20 Hz, 60 Hz, 200 Hz, 600 Hz, 2 kHz, 6 kHz, 20 kHz reference markers
- **Color legend**: Sub, Bass, Low-Mid, Mid, High-Mid, High with color dots

---

## Parameter Reference

### Synthesis Parameters (modulated in real-time)

| Parameter | Range | Formula | Description |
|-----------|-------|---------|-------------|
| Filter Cutoff | 300 -- 7300 Hz | 300 + Alpha×5000 + Beta×2000 | Lowpass filter frequency for all layers |
| Resonance | 0.5 -- 9.5 | 0.5 + Gamma×6 + Complexity×3 | Filter Q factor (resonant peak) |
| Delay Feedback | 20% -- 65% | 0.2 + Theta×0.45 | Echo persistence |
| Delay Mix | 15% -- 50% | 0.15 + Theta×0.35 | Wet/dry balance for delay |
| Delay Filter | 1500 -- 4500 Hz | 1500 + (1-Alpha)×3000 | Brightness of echoes |
| Distortion Drive | 0% -- 35% | BurstIntensity × Intensity × 0.35 | Waveshaper amount |
| Chorus Amount | 0% -- 30% | Coherence × Intensity × 0.3 | Chorus wet level |
| Chorus Rate | 0.2 -- 2.7 Hz | 0.2 + Microvariability × 2.5 | Chorus LFO speed |
| Reverb Amount | 25% -- 75% | 0.25 + Delta × 0.5 | Reverb wet level |

### Global Controls

| Parameter | Range | Description |
|-----------|-------|-------------|
| Intensity | 0 -- 100% | Master EEG response sensitivity |
| Zoom | 0.5x -- 5.0x | Waveform display magnification |
| Master Gain | 0.4 (fixed) | Output volume normalization |

---

## Signal Flow Diagram

```
                    ┌──────────────────────────────────────────┐
                    │           EEG Data Generator             │
                    │  60 samples × 120s × 256 Hz              │
                    │  Pink noise + envelopes + evolution       │
                    └──────────────┬───────────────────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────────────────┐
                    │         Feature Extraction               │
                    │  256-sample rolling window                │
                    │  12 metrics: bands + complex features     │
                    └──────────────┬───────────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
     ┌─────────────┐    ┌─────────────────┐   ┌──────────────┐
     │  6 Synth     │    │  Effects Chain   │   │  UI Updates  │
     │  Layers      │    │                 │   │              │
     │              │    │  Delay (Theta)  │   │  Waveform    │
     │  Sub Bass    │    │  Reverb (Delta) │   │  Spectrum    │
     │  Pad 1       │───▶│  Dist (Bursts)  │   │  Meters      │
     │  Pad 2       │    │  Chorus (Coh.)  │   │  LEDs        │
     │  Pad 3       │    │                 │   │  Parameters  │
     │  Texture     │    └────────┬────────┘   └──────────────┘
     │  Accent      │             │
     └──────┬───────┘             │
            │                     │
            ▼                     ▼
     ┌──────────────┐    ┌──────────────┐
     │  Master Gain  │    │   Wet Mix    │
     │  (0.4)        │    │              │
     └──────┬────────┘    └──────┬───────┘
            │                     │
            └──────────┬──────────┘
                       ▼
              ┌──────────────────┐
              │    Analyser      │
              │  (FFT 2048)      │──── Spectrum Analyzer
              └────────┬─────────┘
                       ▼
              ┌──────────────────┐
              │  Audio Output    │
              │  (Speakers)      │
              └──────────────────┘
```

---

## Technical Specifications

| Specification | Value |
|--------------|-------|
| Audio engine | Web Audio API (native, zero dependencies) |
| Sample rate | Browser default (44.1 or 48 kHz) |
| EEG sample rate | 256 Hz |
| EEG recording duration | 120 seconds (30,720 samples) |
| Synthesis voices | 6 layers × 5 oscillators = 30 oscillators |
| FFT size | 2048 bins |
| FFT smoothing | 0.85 |
| Animation frame rate | 60 fps (16.67ms) |
| Feature window | 256 samples (~1 second) |
| Features extracted | 12 per frame |
| Bundle size (production) | ~245 KB JS + ~22 KB CSS (gzipped: ~77 KB + ~6 KB) |
| External audio dependencies | None |
| Browser requirements | Web Audio API, Canvas 2D, ES2020+ |
| Supported browsers | Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ |

---

## Roadmap

### Phase 2: Live EEG Hardware Integration

The architecture is designed for direct connection to consumer EEG headsets:

- **Muse 2 / Muse S** --- 4-channel EEG via Web Bluetooth, widely available consumer devices
- **OpenBCI** --- 8/16-channel research-grade EEG via serial/Bluetooth, for higher-fidelity data
- **Real-time streaming** --- Replace the pre-generated 120-second buffer with a continuous live data stream, enabling infinite-duration sessions
- **Artifact rejection** --- Automatic detection and removal of eye blinks, muscle artifacts, and electrode noise from live signals

### Phase 3: Enhanced Synthesis

- **Additional synthesis modes** --- FM synthesis, granular synthesis, wavetable options
- **User-configurable EEG-to-parameter mapping** --- drag-and-drop routing of any EEG feature to any synthesis parameter
- **MIDI output** --- Route EEG-derived note and CC data to external DAWs and hardware synthesizers
- **Preset system** --- Save and recall synthesis configurations
- **Recording and export** --- Render generative sessions to WAV/MP3

### Phase 4: Platform Expansion

- **Mobile app** (React Native) with Muse headset Bluetooth pairing
- **Multi-user sessions** --- Multiple EEG streams driving a shared soundscape
- **Cloud library** --- Share and discover EEG patterns and synthesis presets
- **API** --- Expose the synthesis engine for integration into third-party wellness and research platforms

---

## Credits

**Audio Engine** --- Built entirely on the Web Audio API. No external audio libraries.

**EEG Science** --- Sample parameters modeled on published EEG research across sleep science, meditation studies, cognitive neuroscience, and emotional neuroscience literature.

**Design** --- Interface inspired by the aesthetic legacy of 2000s VST plugins: Toxic BioHazard (Image-Line), Absynth (Native Instruments), and Cthulhu (Xfer Records).

**Typography** --- Orbitron by Matt McInerney (display), JetBrains Mono by JetBrains (monospace).

---

*EEG Ambient Synth v1.0.0 --- Pure Brain Mode*
