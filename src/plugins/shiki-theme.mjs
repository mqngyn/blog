// Custom Shiki theme built from DESIGN_SYSTEM.md section 4 (code colors).
const C = {
  bg: '#1E293B',
  text: '#F8FAFC',
  keyword: '#C084FC',
  fn: '#67E8F9',
  string: '#A3E635',
  number: '#FBBF24',
  comment: '#94A3B8',
  error: '#F87171',
  type: '#38BDF8',
  punct: '#CBD5E1',
};

export const mqDark = {
  name: 'mq-dark',
  type: 'dark',
  colors: {
    'editor.background': C.bg,
    'editor.foreground': C.text,
  },
  settings: [
    { settings: { background: C.bg, foreground: C.text } },
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: C.comment, fontStyle: 'italic' } },
    {
      scope: ['keyword', 'keyword.control', 'keyword.operator.new', 'keyword.operator.logical', 'keyword.operator.expression', 'storage', 'storage.type', 'storage.modifier'],
      settings: { foreground: C.keyword },
    },
    {
      scope: ['entity.name.function', 'support.function', 'meta.function-call entity.name.function', 'meta.function-call.generic', 'support.function.builtin', 'entity.name.command'],
      settings: { foreground: C.fn },
    },
    {
      scope: ['string', 'string.quoted', 'punctuation.definition.string', 'markup.inserted'],
      settings: { foreground: C.string },
    },
    {
      scope: ['constant.numeric', 'constant.language', 'constant.character', 'constant.other', 'support.constant'],
      settings: { foreground: C.number },
    },
    {
      scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'entity.other.inherited-class'],
      settings: { foreground: C.type },
    },
    { scope: ['variable', 'variable.other', 'variable.parameter', 'meta.definition.variable'], settings: { foreground: C.text } },
    { scope: ['variable.language', 'variable.other.constant'], settings: { foreground: C.number } },
    { scope: ['punctuation', 'meta.brace', 'keyword.operator'], settings: { foreground: C.punct } },
    { scope: ['invalid', 'invalid.illegal', 'markup.deleted', 'message.error'], settings: { foreground: C.error } },
    { scope: ['markup.heading', 'entity.name.section'], settings: { foreground: C.fn, fontStyle: 'bold' } },
    { scope: ['markup.italic'], settings: { fontStyle: 'italic' } },
    { scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
  ],
};
