/**
 * AUD9ja Web Audio API Fallback Synthesizer
 * Generates authentic Afrobeats, Amapiano, and Benue Highlife rhythms
 * with log-drums, polyrhythmic shakers, kicks, and pentatonic chord stabs.
 */

class WebAudioSynth {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private intervalId: number | null = null;
  private step = 0;
  private bpm = 112; // Standard Afrobeats/Amapiano groove tempo
  private isRunning = false;
  private currentStyle: 'amapiano' | 'afrobeats' | 'highlife' = 'afrobeats';
  private connectedMediaElement: HTMLMediaElement | null = null;
  private mediaSourceNode: MediaElementAudioSourceNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    this.initContext();
    return this.analyser;
  }

  public connectAudioElement(audioEl: HTMLMediaElement) {
    this.initContext();
    if (this.connectedMediaElement === audioEl || !this.ctx || !this.analyser) return;

    try {
      if (!this.mediaSourceNode) {
        this.mediaSourceNode = this.ctx.createMediaElementSource(audioEl);
        this.mediaSourceNode.connect(this.analyser);
        // Note: HTML audio usually already connects to destination; connecting to analyser allows visualization
        this.connectedMediaElement = audioEl;
      }
    } catch (err) {
      // In case element is already connected across mounts
      console.warn('Audio element source connection info:', err);
    }
  }

  public setVolume(volume: number) {
    if (this.masterGain && this.ctx) {
      const safeVol = Math.max(0, Math.min(1, volume));
      this.masterGain.gain.setTargetAtTime(safeVol, this.ctx.currentTime, 0.05);
    }
  }

  // Trigger punchy kick drum
  private playKick(time: number, isSub = false) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const startFreq = isSub ? 120 : 150;
    const endFreq = isSub ? 38 : 45;

    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(endFreq, time + 0.08);

    gain.gain.setValueAtTime(isSub ? 0.9 : 0.7, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (isSub ? 0.45 : 0.25));

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + (isSub ? 0.45 : 0.25));
  }

  // Authentic Amapiano Log Drum: pitch-bending sub bass with woody transient
  private playLogDrum(time: number, noteFreq = 55) {
    if (!this.ctx || !this.masterGain) return;

    // Sub bass glide
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';

    // Characteristic downward pitch bend
    subOsc.frequency.setValueAtTime(noteFreq * 1.8, time);
    subOsc.frequency.exponentialRampToValueAtTime(noteFreq, time + 0.06);

    subGain.gain.setValueAtTime(0.85, time);
    subGain.gain.exponentialRampToValueAtTime(0.001, time + 0.38);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(time);
    subOsc.stop(time + 0.38);

    // Punch transient
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(320, time);
    clickOsc.frequency.exponentialRampToValueAtTime(80, time + 0.03);

    clickGain.gain.setValueAtTime(0.6, time);
    clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);
    clickOsc.start(time);
    clickOsc.stop(time + 0.04);
  }

  // African Shaker / Shekere: bandpass noise pulse with human swing
  private playShaker(time: number, accent = false) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.05;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(accent ? 5200 : 4200, time);
    filter.Q.setValueAtTime(3, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(accent ? 0.35 : 0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  // Wooden rimshot / talking drum tap
  private playRimshot(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, time);
    osc.frequency.exponentialRampToValueAtTime(160, time + 0.03);

    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.06);
  }

  // Warm Rhodes / Kalimba pentatonic chord stabs
  private playChord(time: number, chordType: 'tonic' | 'sub' | 'dom') {
    if (!this.ctx || !this.masterGain) return;

    // African pentatonic chord notes (Hz)
    // Rooted around D major / B minor: D(293), F#(370), A(440), B(493), E(330)
    let notes = [293.66, 369.99, 440.0]; // D maj
    if (chordType === 'sub') {
      notes = [246.94, 293.66, 369.99, 440.0]; // Bm7
    } else if (chordType === 'dom') {
      notes = [220.0, 277.18, 329.63, 440.0]; // A maj
    }

    notes.forEach((freq) => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(time);
      osc.stop(time + 0.4);
    });
  }

  // 16-step sequencer loop
  private tick() {
    if (!this.ctx || !this.isRunning) return;
    const now = this.ctx.currentTime;
    const step = this.step % 16;

    // Swing shaker on all 16ths with syncopated accents
    const isAccent = step % 4 === 2 || step === 7 || step === 14;
    this.playShaker(now, isAccent);

    if (this.currentStyle === 'amapiano') {
      // Amapiano signature pattern
      if (step === 0 || step === 8) {
        this.playKick(now, false);
      }
      // Log drums on off-beats: 4, 7, 10, 12, 15
      if (step === 4) this.playLogDrum(now, 55); // A1
      if (step === 7) this.playLogDrum(now, 65.4); // C2
      if (step === 10) this.playLogDrum(now, 49); // G1
      if (step === 12) this.playLogDrum(now, 55);
      if (step === 15) this.playLogDrum(now, 73.4); // D2

      // Atmospheric chord on bar start and halfway
      if (step === 0) this.playChord(now, 'tonic');
      if (step === 8) this.playChord(now, 'sub');
    } else if (this.currentStyle === 'highlife') {
      // Gboko Highlife & Benue groove
      // Four on the floor kick with energetic rimshot polyrhythm
      if (step === 0 || step === 4 || step === 8 || step === 12) {
        this.playKick(now, false);
      }
      // Clave / rimshot syncopation (3:2 son / Tiv pulse)
      if (step === 0 || step === 3 || step === 6 || step === 10 || step === 12) {
        this.playRimshot(now);
      }
      if (step === 0) this.playChord(now, 'tonic');
      if (step === 6) this.playChord(now, 'sub');
      if (step === 12) this.playChord(now, 'dom');
    } else {
      // Afrobeats Mainstream Groove
      if (step === 0 || step === 6 || step === 8 || step === 14) {
        this.playKick(now, step === 0);
      }
      if (step === 4 || step === 12) {
        this.playRimshot(now);
      }
      if (step === 0) this.playChord(now, 'tonic');
      if (step === 10) this.playChord(now, 'sub');
    }

    this.step++;
  }

  public startPattern(style: 'amapiano' | 'afrobeats' | 'highlife' = 'afrobeats') {
    this.initContext();
    this.currentStyle = style;
    if (this.isRunning) return;

    this.isRunning = true;
    this.step = 0;
    const intervalMs = (60 / this.bpm / 4) * 1000; // 16th notes
    this.intervalId = window.setInterval(() => this.tick(), intervalMs);
  }

  public stopPattern() {
    this.isRunning = false;
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public isPatternRunning(): boolean {
    return this.isRunning;
  }
}

export const webAudioSynth = new WebAudioSynth();
