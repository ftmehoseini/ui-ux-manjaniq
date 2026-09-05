# Fafobot

A desktop social robot that helps a student practise spoken English. It
listens, understands, answers like a patient teacher, speaks the answer out
loud, and reacts with an animated face. If the student speaks Persian, it
translates first — so a beginner is never stuck at "I don't know how to start".

An ESP32-S3 handles the microphone, speaker and OLED face. A Python backend
handles the listening, thinking and speaking.

```
INMP441 → ESP32-S3 → WiFi → FastAPI → speech to text → language detection
                                              ↓
                                    Persian? → translate → LLM (teacher)
                                              ↓
speaker ← MAX98357A ← ESP32-S3 ← WiFi ← text to speech
                          ↓
                   SSD1306 face: LISTENING → THINKING → SPEAKING → HAPPY
```

## Quick start

Backend:

```bash
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # add your OPENAI_API_KEY
uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

Try it without any hardware:

```bash
curl -X POST localhost:8000/api/chat -H 'content-type: application/json' \
     -d '{"text": "من دیروز به مدرسه رفتم"}'
```

Talk to it without any hardware — the simulator uses your laptop's microphone,
speakers and terminal in place of the robot's, over the identical protocol:

```bash
python -m robot.simulator
```

Robot:

```bash
cp firmware/include/secrets.example.h firmware/include/secrets.h   # WiFi + backend IP
cd firmware && pio run -e robot -t upload && pio device monitor
```

## Hardware

| Part | Role | Pins (ESP32-S3) |
|---|---|---|
| INMP441 | I2S microphone | BCLK 4, WS 5, SD 6, L/R→GND, 3V3 |
| MAX98357A | I2S amplifier | BCLK 15, LRC 16, DIN 7, SD 17, 5 V |
| SSD1306 128×64 | face | SDA 8, SCL 9, 3V3 |
| BOOT button | push-to-talk | GPIO0 |

Full wiring notes, including the mistakes that produce each symptom, are in
[docs/ENGINEERING.md](docs/ENGINEERING.md#2-hardware).

## Bring-up order

Each phase is verifiable on its own, so a failure tells you which layer it is
in:

1. **Hardware** — four self-test binaries, one per peripheral plus a loopback:
   `pio run -e selftest_oled -t upload`, then `selftest_mic`,
   `selftest_speaker`, `selftest_loopback`.
2. **Voice communication** — flash `-e robot`, confirm audio survives the round
   trip.
3. **AI brain** — all backend work, iterated through the simulator.
4. **Social interaction** — face animation synchronised to the actual playback
   amplitude.

## Layout

```
backend/    FastAPI service: STT, translation, LLM, TTS, emotion state machine
firmware/   ESP32-S3 (PlatformIO): I2S audio, OLED face, WebSocket client
robot/      desktop simulator speaking the same protocol as the firmware
tests/      pytest suite — no hardware, no network, no API key
docs/       engineering document and the wire protocol
```

## Tests

```bash
python -m pytest
```

78 tests covering the state machine, the turn pipeline, the session layer,
audio maths and the voice activity detector. One of them parses the firmware's
C++ header to make sure the robot and the backend still agree on what the
states are called.

## Documentation

- [docs/ENGINEERING.md](docs/ENGINEERING.md) — system overview, hardware,
  architecture, installation, implementation order, testing, troubleshooting.
- [docs/PROTOCOL.md](docs/PROTOCOL.md) — the WebSocket contract.

## Scope

Version one is a robot that listens, talks and shows emotion while helping
someone practise conversation. Student accounts, progress tracking, vocabulary
lists and curricula are deliberately out of scope — they are all easier to add
to a system that already does the above well.
