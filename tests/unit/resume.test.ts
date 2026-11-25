import { describe, expect, it } from 'vitest';
import { findViolations } from '../../scripts/lib/content-rules.mjs';
import { resume } from '../../src/lib/resume';

const all = JSON.stringify(resume);

describe('resume content', () => {
  it('fills every fact token', () => {
    expect(all).not.toMatch(/\{[a-zA-Z]+\}/);
  });

  it('leads Experience with Preflight and links it', () => {
    const preflight = resume.experience[0];
    expect(preflight.org).toBe('Preflight, open-source AI job-application agent');
    expect(preflight?.link?.href).toBe('https://github.com/Blakells/preflight');
  });

  it('names the upstream project only with its credit', () => {
    expect(all).toContain('ApplyPilot 0.3.0 by Pickle-Pixel');
    expect(findViolations(all, 'all')).toEqual([]);
  });

  it('lists Security+ first, then the expected degree, with no completion percentage', () => {
    expect(resume.education[0]).toMatchObject({ title: 'CompTIA Security+', dates: 'November 2026' });
    expect(resume.education[1]).toMatchObject({
      title: 'B.A. in Liberal Studies',
      org: 'Thomas Edison State University',
      dates: 'Expected March 2027',
    });
    expect(all).not.toMatch(/\d+ ?%/);
  });

  it('has no figures about finances and leaves out the brake-fade story', () => {
    expect(all).not.toMatch(/-figure|\$\d/);
    expect(all.toLowerCase()).not.toContain('brake fade');
  });

  it('lists Umbreonics as a founder role and describes the GPU platform as in progress', () => {
    const umbreonics = resume.experience[1];
    expect(umbreonics).toMatchObject({ title: 'Founder', dates: 'October 2026 – Present' });
    expect(umbreonics?.link?.href).toBe('https://umbreonics.com');
    expect(all).toContain('Designing and building the platform');
    expect(all).not.toContain('Built a local inference server');
  });

  it('links the portfolio site and both games', () => {
    const shipped = resume.projectNotes.flatMap((note) => note.items.map((item) => item.label));
    expect(shipped).toEqual(['blakells.dev', 'Tidewood Isle', 'Lantern Hollow']);
  });
});
