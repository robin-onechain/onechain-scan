<template>
  <pre><code class="language-move line-numbers">{{ value }}</code></pre>
</template>

<script lang="ts" setup>
import { watch, nextTick } from "vue";
import Prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";

// 定义 Move 语言的语法高亮
Prism.languages.move = {
  comment: /\/\/.*|\/\*[\s\S]*?\*\//,
  string: {
    pattern: /"(?:\\.|[^\\"])*"/,
    greedy: true
  },
  keyword:
    /\b(?:module|struct|fun|public|move|copy|borrow|let|return|if|else|while|loop|break|continue|true|false)\b/,
  function: /\b\w+(?=\s*\()/,
  number: /\b\d+\b/,
  operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&|\|\|?|[?*/~^%]/,
  punctuation: /[{}[\];(),.:]/
};

const props = defineProps<{
  value: string;
}>();

watch(
  () => props.value,
  async () => {
    await nextTick();
    const codeBlock = document.querySelector("pre code.language-move");
    if (codeBlock) {
      Prism.highlightElement(codeBlock);
    }
  }
);
</script>

<style lang="scss" scoped>
pre {
  margin: 0;
  overflow: auto;
  border-radius: 6px;
  background: #f8fafd;
}
</style>
