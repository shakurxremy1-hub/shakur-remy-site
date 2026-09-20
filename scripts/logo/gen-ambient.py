#!/usr/bin/env python3
"""Generates an original, seamlessly-loopable ambient pad — warm, slow-moving,
matching the site's dusk/gold luxury tone. Pure numpy synthesis (detuned sine
stack + slow amplitude drift + a simple comb/allpass reverb for space), no
external samples, so it's fully original with zero licensing questions.

Usage: python3 scripts/logo/gen-ambient.py
Writes assets/audio/ambient.wav (encode to mp3 separately via ffmpeg).
"""
import numpy as np
import os
import wave
from scipy.signal import lfilter

SR = 44100
DUR = 32.0  # seconds, loop length
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "assets/audio")
os.makedirs(OUT, exist_ok=True)

t = np.linspace(0, DUR, int(SR * DUR), endpoint=False)

# E major add9-ish chord, voiced low-to-high for warmth: E2 B2 E3 G#3 B3 F#4
freqs = [82.41, 123.47, 164.81, 207.65, 246.94, 369.99]
weights = [0.9, 0.55, 0.7, 0.5, 0.42, 0.22]

voice = np.zeros_like(t)
rng = np.random.default_rng(7)
for f, w in zip(freqs, weights):
    # a few slightly-detuned partials per note for a warm, chorus-y texture
    for detune, dw in [(-0.06, 0.5), (0.0, 1.0), (0.05, 0.5)]:
        phase = rng.uniform(0, 2 * np.pi)
        voice += w * dw * np.sin(2 * np.pi * f * (1 + detune / 100) * t + phase)

# slow amplitude drift so the chord "breathes" instead of sitting static
drift = 0.75 + 0.25 * np.sin(2 * np.pi * t / 11.0 + 0.6)
voice *= drift

# soft attack/release envelope for a seamless loop (fades match at both ends)
fade = int(SR * 4.0)
env = np.ones_like(t)
env[:fade] = np.linspace(0, 1, fade) ** 2
env[-fade:] = np.linspace(1, 0, fade) ** 2
voice *= env

# gentle one-pole low-pass to soften harmonics (warm, not bright/digital)
alpha = 0.06
voice = lfilter([alpha], [1, -(1 - alpha)], voice)

# simple comb + allpass reverb for a sense of space (IIR via scipy.lfilter —
# a plain Python per-sample loop over a 32s buffer is far too slow)
def comb(x, delay_ms, decay):
    d = int(SR * delay_ms / 1000)
    b = np.zeros(d + 1); b[0] = 1.0
    a = np.zeros(d + 1); a[0] = 1.0; a[d] = -decay
    return lfilter(b, a, x)

def allpass(x, delay_ms, g):
    d = int(SR * delay_ms / 1000)
    b = np.zeros(d + 1); b[0] = -g; b[d] = 1.0
    a = np.zeros(d + 1); a[0] = 1.0; a[d] = -g
    return lfilter(b, a, x)

wet = comb(voice, 47.3, 0.35) + comb(voice, 59.1, 0.32) + comb(voice, 71.7, 0.28)
wet = allpass(wet, 12.6, 0.5)
wet = allpass(wet, 5.1, 0.5)
mix = voice * 0.7 + wet * 0.22

# gentle stereo width via a tiny delay + filtered difference on one channel
left = mix
right = np.roll(mix, int(SR * 0.012)) * 0.98

peak = max(np.abs(left).max(), np.abs(right).max())
left = left / peak * 0.65
right = right / peak * 0.65

stereo = np.stack([left, right], axis=1)
pcm = (stereo * 32767).astype(np.int16)

path = os.path.join(OUT, "ambient.wav")
with wave.open(path, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("wrote", path, f"({DUR}s, {SR}Hz stereo)")
