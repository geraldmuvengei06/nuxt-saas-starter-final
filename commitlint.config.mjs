export default {
  extends: ['@commitlint/config-conventional'],
  helpUrl: 'https://www.conventionalcommits.org/en/v1.0.0/',
  // Optional: add any custom rules here
  rules: {
    'body-max-line-length': [2, 'always', 100],
    'subject-case': [
      2,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case']
    ],
  },
  prompt: {
    settings: {
      enableMultipleScopes: true,
      scopeEnumSeparator: ',',
      upperCaseSubject: false,
    },
    messages: {
      skip: '(optional)',
      max: 'upper %d chars',
      min: '%d chars at least',
      emptyWarning: 'can not be empty',
      upperLimitWarning: 'over limit',
      lowerLimitWarning: 'below limit'
    },
    questions: {
      type: {
        description: 'Select the type of change you\'re committing:',
        enum: {
          feat: {
            description: '✨ A new feature',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: '🐛 A bug fix',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: '📚 Documentation only changes',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: '💎 Changes that do not affect the meaning of the code',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: '📦 A code change that neither fixes a bug nor adds a feature',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: '🚀 A code change that improves performance',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: '🚨 Adding missing tests or correcting existing tests',
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description: '🛠 Changes that affect the build system or external dependencies',
            title: 'Builds',
            emoji: '🛠',
          },
          ci: {
            description: '⚙️ Changes to CI configuration files and scripts',
            title: 'Continuous Integration',
            emoji: '⚙️',
          },
          chore: {
            description: '♻️ Other changes that don\'t modify src or test files',
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: '🗑 Reverts a previous commit',
            title: 'Reverts',
            emoji: '🗑',
          },
        },
      },
      scope: {
        description: 'What is the scope of this change (e.g. component, feature name, file)?',
        enum: {
          auth: {
            description: 'Changes related to authentication',
          },
          db: {
            description: 'Database schema or query changes'
          },
          ui: {
            description: 'UI component changes'
          },
          api: {
            description: 'API endpoint changes'
          },
          stripe: {
            description: 'Payment/subscription related changes'
          },
          // Add more project-specific scopes as needed
        }
      },
      subject: {
        description: 'Write a short, imperative tense description of the change'
      },
      body: {
        description: 'Provide a longer description of the change'
      },
      breaking: {
        description: 'List any breaking changes'
      },
      footer: {
        description: 'List any issues affected by this change (e.g. "fixes #123")'
      },
      confirmCommit: {
        description: 'Are you sure you want to proceed with the commit above?'
      }
    }
  }
};
