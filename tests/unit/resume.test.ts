import { describe, expect, it } from 'vitest';
import { resume } from '../../src/lib/resume';

const all = JSON.stringify(resume);

describe('resume content', () => {
  it('fills every fact token', () => {
    expect(all).not.toMatch(/\{[a-zA-Z]+\}/);
  });

  it('names the project Preflight, links it, and attributes the live applications to its predecessor', () => {
    const preflight = resume.projects.find((p) => p.title === 'Preflight');
    expect(preflight?.link?.href).toBe('https://github.com/Blakells/preflight');
    expect(all).toContain('private predecessor');
    expect(all).not.toContain('ApplyPilot');
  });

  it('lists the degree as an expected bachelor\'s degree, with no completion percentage', () => {
    expect(resume.education[0]).toMatchObject({
      title: "Bachelor's degree",
      org: 'Thomas Edison State University',
      dates: 'Expected March 2027',
    });
    expect(all).not.toMatch(/\d+ ?%/);
  });

  it('has no figures about finances and leaves out the brake-fade story', () => {
    expect(all).not.toMatch(/-figure|\$\d/);
    expect(all.toLowerCase()).not.toContain('brake fade');
  });

  it('includes the built inference server and Lantern Hollow', () => {
    expect(all).toContain('Built a local inference server (4× RTX 6000 Pro)');
    expect(resume.projects.map((p) => p.title)).toContain('Lantern Hollow');
  });
});
