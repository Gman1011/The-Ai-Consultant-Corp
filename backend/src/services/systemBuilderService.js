/**
 * System Builder Service
 *
 * Implements the critical flow:
 * Pattern → Rule → Mandatory System Creation → AI Critique
 *
 * This is what separates a "brain game" from a "cognitive retooling platform for the AGI age"
 */

const axios = require('axios');

class SystemBuilderService {
  /**
   * Generate a pattern-based challenge
   * Shows users examples that contain a hidden pattern/principle
   */
  static generatePatternChallenge(difficulty, ageGroup = 'adult') {
    const challenges = this.getChallengeTemplates(difficulty, ageGroup);
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];

    return {
      problemId: `system-builder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      difficulty,
      patternType: challenge.type,
      examples: challenge.examples,
      context: challenge.context,
      expectedPattern: challenge.pattern, // Hidden from user
      expectedRule: challenge.rule, // For evaluation
      systemPrompt: challenge.systemPrompt,
      evaluationCriteria: challenge.evaluationCriteria
    };
  }

  /**
   * Challenge templates organized by difficulty and domain
   */
  static getChallengeTemplates(difficulty, ageGroup) {
    // For ages 13+, focus on real-world career/cognitive challenges
    const templates = [
      // EASY (1-30): Foundation patterns
      {
        type: 'process-optimization',
        difficulty: 15,
        context: 'You notice your team keeps missing deadlines on similar projects.',
        examples: [
          { project: 'Website Redesign', days: 45, outcome: 'Late by 2 weeks', issues: ['scope creep', 'unclear requirements', 'no milestones'] },
          { project: 'Mobile App Feature', days: 30, outcome: 'Late by 1 week', issues: ['scope creep', 'changing requirements', 'no checkpoints'] },
          { project: 'Marketing Campaign', days: 20, outcome: 'On time!', issues: ['clear scope', 'weekly reviews', 'fixed requirements'] },
          { project: 'Database Migration', days: 60, outcome: 'Late by 3 weeks', issues: ['scope expanded', 'no interim goals', 'vague specs'] }
        ],
        pattern: 'Projects without clear milestones and scope control consistently run late',
        rule: 'Fixed checkpoints + scope freezes prevent deadline slips',
        systemPrompt: 'CREATE a project management system/process that prevents this pattern from continuing. Your system must be something you could implement starting tomorrow.',
        evaluationCriteria: {
          mustHave: ['concrete checkpoints', 'scope control mechanism', 'accountability structure'],
          novelty: 'Does it go beyond "use better planning"?',
          effectiveness: 'Could this actually prevent the pattern?',
          completeness: 'Can someone else implement this from your description?'
        }
      },
      {
        type: 'cognitive-bottleneck',
        difficulty: 20,
        context: 'You analyze when you do your best vs worst thinking during the day.',
        examples: [
          { time: '9am', task: 'Strategic planning', quality: 'Excellent', energy: 'High', interruptions: 0 },
          { time: '11am', task: 'Email responses', quality: 'Good', energy: 'Medium', interruptions: 5 },
          { time: '2pm', task: 'Creative design', quality: 'Poor', energy: 'Low', interruptions: 8 },
          { time: '4pm', task: 'Routine coding', quality: 'Medium', energy: 'Low', interruptions: 3 },
          { time: '7pm', task: 'Writing', quality: 'Excellent', energy: 'High', interruptions: 0 }
        ],
        pattern: 'High-cognitive tasks succeed during low-interruption, high-energy windows',
        rule: 'Match task cognitive load to energy level and interruption-free availability',
        systemPrompt: 'CREATE a personal productivity system that exploits this pattern. It should help you (or anyone) structure their day based on cognitive capacity cycles.',
        evaluationCriteria: {
          mustHave: ['task categorization by cognitive load', 'energy/attention mapping', 'scheduling algorithm or process'],
          novelty: 'Does it go beyond "calendar blocking"?',
          effectiveness: 'Would this measurably improve output quality?',
          completeness: 'Could you start using this tomorrow?'
        }
      },

      // MEDIUM (31-60): Multi-variable patterns
      {
        type: 'ai-disruption-response',
        difficulty: 45,
        context: 'Your industry is being transformed by AI. You study which roles are thriving vs struggling.',
        examples: [
          { role: 'Customer Service Rep', ai_impact: 'Automated', skill_level: 'Low', outcome: 'Displaced', future: 'Uncertain' },
          { role: 'CS Rep + Process Designer', ai_impact: 'Augmented', skill_level: 'Medium', outcome: 'Promoted', future: 'Strong' },
          { role: 'Data Entry Specialist', ai_impact: 'Eliminated', skill_level: 'Low', outcome: 'Laid off', future: 'Poor' },
          { role: 'Data Analyst', ai_impact: 'Enhanced', skill_level: 'High', outcome: 'Expanded role', future: 'Excellent' },
          { role: 'Graphic Designer (templates)', ai_impact: 'Automated', skill_level: 'Medium', outcome: 'Struggling', future: 'Declining' },
          { role: 'Creative Director (strategy)', ai_impact: 'Augmented', skill_level: 'High', outcome: 'Thriving', future: 'Growing' }
        ],
        pattern: 'Roles focused on execution get automated; roles focused on judgment/strategy get augmented',
        rule: 'To AI-proof yourself: shift from "doing tasks" to "designing systems and making judgment calls"',
        systemPrompt: 'CREATE a career retooling framework that helps someone transition from an execution role to a strategic/judgment role. It should be a concrete process, not vague advice.',
        evaluationCriteria: {
          mustHave: ['skill gap identification method', 'transition pathway', 'proof-of-competence system'],
          novelty: 'Does it go beyond "learn AI tools"?',
          effectiveness: 'Could this actually transform someone\'s career trajectory?',
          completeness: 'Could someone follow this as a 6-month plan?'
        }
      },

      // HARD (61-85): Abstract/meta patterns
      {
        type: 'meta-learning-acceleration',
        difficulty: 70,
        context: 'You notice some people learn new skills 10x faster than others. You collect data on their approaches.',
        examples: [
          { learner: 'Fast Learner A', method: 'Build projects immediately', theory: 'Minimal', practice: 'Intensive', retention: '95%', time_to_competence: '2 weeks' },
          { learner: 'Slow Learner B', method: 'Complete courses first', theory: 'Extensive', practice: 'Delayed', retention: '60%', time_to_competence: '3 months' },
          { learner: 'Fast Learner C', method: 'Teach while learning', theory: 'Just-in-time', practice: 'Applied', retention: '90%', time_to_competence: '3 weeks' },
          { learner: 'Slow Learner D', method: 'Read documentation', theory: 'Heavy', practice: 'Light', retention: '50%', time_to_competence: '4 months' },
          { learner: 'Fast Learner E', method: 'Reverse engineer examples', theory: 'Minimal', practice: 'Exploratory', retention: '88%', time_to_competence: '2.5 weeks' }
        ],
        pattern: 'Immediate application + teaching/explaining = 10x faster competence vs passive consumption',
        rule: 'Compress theory-practice gap to near-zero; force output before feeling ready',
        systemPrompt: 'CREATE a learning acceleration system that anyone could use to learn ANY new skill 5-10x faster than traditional methods. It must be concrete and repeatable.',
        evaluationCriteria: {
          mustHave: ['forcing function for immediate practice', 'output/teaching mechanism', 'feedback loop design'],
          novelty: 'Does it go beyond "learning by doing"?',
          effectiveness: 'Would this demonstrably accelerate skill acquisition?',
          completeness: 'Could this be applied to learning Python, public speaking, AND design?'
        }
      },

      // VERY HARD (86-100): AGI-era thinking
      {
        type: 'agi-collaboration-framework',
        difficulty: 92,
        context: 'In an AGI world, the question shifts from "what to do" to "what to do NEXT after AGI does the obvious thing".',
        examples: [
          { scenario: 'AGI writes perfect code', human_then_asks: 'Is this the right problem to solve?', value: 'Problem selection' },
          { scenario: 'AGI designs optimal process', human_then_asks: 'What are we optimizing for? What are we ignoring?', value: 'Values/constraints' },
          { scenario: 'AGI provides 5 solutions', human_then_asks: 'What solution space are we not exploring?', value: 'Blind spot detection' },
          { scenario: 'AGI summarizes research', human_then_asks: 'What questions should we ask that we haven\'t thought of?', value: 'Question formulation' },
          { scenario: 'AGI predicts outcomes', human_then_asks: 'What would make this prediction irrelevant?', value: 'Paradigm shifts' }
        ],
        pattern: 'Human value shifts from execution to meta-cognition: questioning assumptions, values, and problem frames',
        rule: 'In AGI era, humans become "askers of next-level questions" not "doers of tasks"',
        systemPrompt: 'CREATE a cognitive framework/system for "next-level questioning" - a repeatable process for identifying what to ask AFTER AGI gives the obvious answer. This should work across any domain.',
        evaluationCriteria: {
          mustHave: ['question generation method', 'assumption surfacing process', 'paradigm-shift detection'],
          novelty: 'Is this genuinely new thinking, not just "critical thinking 101"?',
          effectiveness: 'Would this reveal blind spots that AGI misses?',
          completeness: 'Could someone use this framework in business, science, AND personal decisions?'
        }
      }
    ];

    // Filter by difficulty range
    const range = difficulty <= 30 ? [0, 30] : difficulty <= 60 ? [31, 60] : difficulty <= 85 ? [61, 85] : [86, 100];
    return templates.filter(t => t.difficulty >= range[0] && t.difficulty <= range[1]);
  }

  /**
   * Evaluate user's articulated rule
   * Returns quality score 0-100
   */
  static evaluateRule(userRule, expectedPattern, expectedRule) {
    // Basic validation
    if (!userRule || userRule.trim().length < 10) {
      return { score: 0, feedback: 'Rule is too short or missing. Explain the pattern you see in 1-2 sentences.' };
    }

    // Check for vagueness
    const vagueWords = ['better', 'good', 'bad', 'important', 'should', 'need', 'must'];
    const hasSpecificity = !vagueWords.every(word => userRule.toLowerCase().includes(word));

    // Check for concrete elements
    const hasConcreteness = /\b(when|if|because|causes|prevents|enables|requires)\b/i.test(userRule);

    // Calculate score
    let score = 30; // Base score for attempting

    if (hasSpecificity) score += 20;
    if (hasConcreteness) score += 20;
    if (userRule.length > 50) score += 10; // Detailed explanation
    if (userRule.length > 100) score += 10; // Very detailed
    if (/\b(pattern|trend|correlation|relationship|cause)\b/i.test(userRule)) score += 10;

    const feedback = score >= 70
      ? 'Strong rule articulation! You identified concrete causes/effects.'
      : score >= 50
      ? 'Good start, but could be more specific. What EXACTLY causes the pattern?'
      : 'Too vague. Describe the specific relationship you see, not just what is "good" or "bad".';

    return { score, feedback };
  }

  /**
   * Generate AI critique of user's system using Claude API
   * This is the critical "AI Critique" phase
   */
  static async generateAICritique(systemDescription, systemType, systemComponents, challenge, userRule) {
    try {
      // Note: In production, use environment variable for API key
      const apiKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY;

      if (!apiKey) {
        // Fallback to rule-based critique if no API key
        return this.generateRuleBasedCritique(systemDescription, systemType, systemComponents, challenge);
      }

      const prompt = `You are an expert evaluator of cognitive systems and frameworks designed to solve real-world problems.

USER'S CHALLENGE:
${challenge.context}

PATTERN THEY IDENTIFIED:
${challenge.pattern}

RULE THEY ARTICULATED:
${userRule}

SYSTEM THEY CREATED:
Type: ${systemType}
Description: ${systemDescription}
Components: ${systemComponents.join(', ')}

EVALUATION CRITERIA:
${JSON.stringify(challenge.evaluationCriteria, null, 2)}

Provide a rigorous critique with:

1. STRENGTHS (2-3 specific things they did well)
2. CRITICAL GAPS (2-3 specific things missing or weak)
3. NOVELTY SCORE (0-100): How creative/original is this? (0 = obvious/generic, 100 = genuinely innovative)
4. COMPLETENESS SCORE (0-100): Could someone implement this tomorrow? (0 = too vague, 100 = fully specified)
5. EFFECTIVENESS SCORE (0-100): Would this actually solve the problem? (0 = wouldn't work, 100 = highly effective)
6. SPECIFIC IMPROVEMENTS (2-3 concrete ways to make this system better)
7. OVERALL ASSESSMENT (2-3 sentences)

Be tough but constructive. This is cognitive training for the AGI era - we need systems thinking, not surface-level answers.`;

      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{
            role: 'user',
            content: prompt
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          }
        }
      );

      const critiqueText = response.data.content[0].text;

      // Parse the response to extract scores
      const noveltyMatch = critiqueText.match(/NOVELTY SCORE[:\s]+(\d+)/i);
      const completenessMatch = critiqueText.match(/COMPLETENESS SCORE[:\s]+(\d+)/i);
      const effectivenessMatch = critiqueText.match(/EFFECTIVENESS SCORE[:\s]+(\d+)/i);

      const novelty = noveltyMatch ? parseInt(noveltyMatch[1]) : 50;
      const completeness = completenessMatch ? parseInt(completenessMatch[1]) : 50;
      const effectiveness = effectivenessMatch ? parseInt(effectivenessMatch[1]) : 50;

      // Extract strengths and improvements
      const strengthsSection = critiqueText.match(/STRENGTHS:?([\s\S]*?)(?=CRITICAL GAPS|$)/i);
      const improvementsSection = critiqueText.match(/SPECIFIC IMPROVEMENTS:?([\s\S]*?)(?=OVERALL ASSESSMENT|$)/i);

      const strengths = strengthsSection
        ? strengthsSection[1].split('\n').filter(s => s.trim().length > 0).slice(0, 3)
        : ['System shows creative thinking'];

      const improvements = improvementsSection
        ? improvementsSection[1].split('\n').filter(s => s.trim().length > 0).slice(0, 3)
        : ['Add more specific implementation details'];

      return {
        aiCritique: critiqueText,
        strengths,
        improvements,
        novelty,
        completeness,
        effectiveness,
        overallScore: Math.round((novelty + completeness + effectiveness) / 3)
      };

    } catch (error) {
      console.error('Error calling Claude API:', error.message);
      // Fallback to rule-based critique
      return this.generateRuleBasedCritique(systemDescription, systemType, systemComponents, challenge);
    }
  }

  /**
   * Fallback rule-based critique when AI API is unavailable
   */
  static generateRuleBasedCritique(systemDescription, systemType, systemComponents, challenge) {
    const wordCount = systemDescription.split(' ').length;
    const hasComponents = systemComponents && systemComponents.length >= 3;
    const hasConcreteness = /\b(step|process|when|if|then|measure|track|checklist|template)\b/i.test(systemDescription);

    let novelty = 40;
    let completeness = 30;
    let effectiveness = 35;

    const strengths = [];
    const improvements = [];

    // Evaluate novelty
    if (systemType === 'framework' || systemType === 'strategy') novelty += 10;
    if (systemComponents.length >= 4) novelty += 15;
    if (wordCount > 150) novelty += 10;

    // Evaluate completeness
    if (hasConcreteness) completeness += 25;
    if (hasComponents) completeness += 20;
    if (wordCount > 100) completeness += 15;

    // Evaluate effectiveness
    if (/\b(prevent|solve|address|eliminate|improve|optimize)\b/i.test(systemDescription)) effectiveness += 20;
    if (hasComponents && hasConcreteness) effectiveness += 20;
    if (systemDescription.includes('measure') || systemDescription.includes('track')) effectiveness += 15;

    // Generate strengths
    if (hasComponents) strengths.push('✓ Broke system into clear components');
    if (hasConcreteness) strengths.push('✓ Included concrete steps/processes');
    if (wordCount > 100) strengths.push('✓ Provided detailed explanation');

    // Generate improvements
    if (!hasConcreteness) improvements.push('→ Add specific steps or processes');
    if (!hasComponents) improvements.push('→ Break down into distinct components');
    if (wordCount < 100) improvements.push('→ Provide more implementation details');
    if (!systemDescription.includes('measure')) improvements.push('→ Add success metrics or feedback loops');

    const overallScore = Math.round((novelty + completeness + effectiveness) / 3);

    const aiCritique = `SYSTEM EVALUATION

STRENGTHS:
${strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}

AREAS FOR IMPROVEMENT:
${improvements.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}

SCORES:
- Novelty: ${novelty}/100 ${novelty >= 70 ? '(Creative approach)' : novelty >= 50 ? '(Decent creativity)' : '(Fairly standard)'}
- Completeness: ${completeness}/100 ${completeness >= 70 ? '(Well-specified)' : completeness >= 50 ? '(Needs detail)' : '(Too vague)'}
- Effectiveness: ${effectiveness}/100 ${effectiveness >= 70 ? '(Likely to work)' : effectiveness >= 50 ? '(Might work)' : '(Questionable impact)'}

OVERALL: ${overallScore}/100

ASSESSMENT:
${overallScore >= 70 ? 'Strong system design! This shows real systems thinking. With refinement, this could be implemented.' :
  overallScore >= 50 ? 'Good foundation. The system has potential but needs more concrete detail and implementation specifics.' :
  'This needs significant development. Focus on creating a system someone could actually use, not just a high-level idea.'}

Remember: In the AGI age, your value is in building novel systems that go beyond the obvious. Keep pushing your thinking deeper.`;

    return {
      aiCritique,
      strengths: strengths.map(s => s.replace('✓ ', '')),
      improvements: improvements.map(i => i.replace('→ ', '')),
      novelty,
      completeness,
      effectiveness,
      overallScore
    };
  }
}

module.exports = SystemBuilderService;
