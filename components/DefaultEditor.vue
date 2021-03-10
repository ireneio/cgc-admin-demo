<template>
  <div class="editor">
    <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
      <div class="menubar">
        <button
          class="menubar__button"
          :class="{ 'menubar__button--isActive': isActive.bold() }"
          @click="commands.bold"
        >
          <!-- <icon name="bold" /> -->
          <b>B</b>
        </button>
        <button
          class="menubar__button"
          :class="{ 'menubar__button--isActive': isActive.italic() }"
          @click="commands.italic"
        >
          <!-- <icon name="italic" /> -->
          <em>I</em>
        </button>
        <button
          class="menubar__button"
          :class="{ 'menubar__button--isActive': isActive.strike() }"
          @click="commands.strike"
        >
          <!-- <icon name="strike" /> -->
          <span style="text-decoration:line-through;">U</span>
        </button>
        <button
          class="menubar__button"
          :class="{ 'menubar__button--isActive': isActive.underline() }"
          @click="commands.underline"
        >
          <!-- <icon name="underline" /> -->
          <span style="text-decoration:underline;">U</span>
        </button>
        <!-- <button
          class="menubar__button"
          :class="{ 'menubar__button--isActive': isActive.code() }"
          @click="commands.code"
        >
          <icon name="code" />
          <span>{{ '</>' }}</span>
        </button> -->
        <button
          class="menubar__button"
          :class="{ 'menubar__button--isActive': isActive.paragraph() }"
          @click="commands.paragraph"
        >
          <!-- <icon name="paragraph" /> -->
          <span>p</span>
          <!-- <v-icon>mdi-format-paragraph</v-icon> -->
        </button>
        <button
          class="menubar__button"
          :class="{ 'menubar__button--isActive': isActive.heading({ level: 1 }) }"
          @click="commands.heading({ level: 1 })"
        >
          H1
        </button>
        <button
          class="menubar__button"
          :class="{ 'menubar__button--isActive': isActive.heading({ level: 2 }) }"
          @click="commands.heading({ level: 2 })"
        >
          H2
        </button>
        <button
          class="menubar__button"
          :class="{ 'menubar__button--isActive': isActive.heading({ level: 3 }) }"
          @click="commands.heading({ level: 3 })"
        >
          H3
        </button>
        <button
          class="menubar__button"
          :class="{ 'menubar__button--isActive': isActive.bullet_list() }"
          @click="commands.bullet_list"
        >
          <!-- <icon name="ul" /> -->
          <v-icon>mdi-format-list-bulleted</v-icon>
        </button>
        <button
          class="menubar__button"
          :class="{ 'menubar__button--isActive': isActive.ordered_list() }"
          @click="commands.ordered_list"
        >
          <!-- <icon name="ol" /> -->
          <v-icon>mdi-format-list-numbered</v-icon>
        </button>
        <button
          class="menubar__button"
          :class="{ 'menubar__button--isActive': isActive.blockquote() }"
          @click="commands.blockquote"
        >
          <!-- <icon name="quote" /> -->
          <v-icon>mdi-format-quote-close</v-icon>
        </button>
        <!-- <button
          class="menubar__button"
          :class="{ 'menubar__button--isActive': isActive.code_block() }"
          @click="commands.code_block"
        >
          <icon name="code" />
        </button> -->
        <button
          class="menubar__button"
          @click="commands.horizontal_rule"
        >
          <!-- <icon name="hr" /> -->
          <span style="font-weight:bold;">-</span>
        </button>
        <button
          class="menubar__button"
          @click="commands.undo"
        >
          <!-- <icon name="undo" /> -->
          <v-icon>mdi-undo</v-icon>
        </button>
        <button
          class="menubar__button"
          @click="commands.redo"
        >
          <!-- <icon name="redo" /> -->
          <v-icon>mdi-redo</v-icon>
        </button>
      </div>
    </editor-menu-bar>
    <editor-content :editor="editor" />
  </div>
</template>

<script>
// official tiptap example
import Icon from '~/components/DefaultEditorIcon.vue'
import { Editor, EditorContent, EditorMenuBar } from 'tiptap'
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History,
  Placeholder
} from 'tiptap-extensions'
export default {
  components: {
    EditorContent,
    EditorMenuBar,
    Icon,
  },
  data() {
    return {
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
          new Placeholder({
            emptyEditorClass: 'is-editor-empty',
            emptyNodeClass: 'is-empty',
            emptyNodeText: 'Enter Content here …',
            showOnlyWhenEditable: true,
            showOnlyCurrent: true,
          }),
        ],
        content: ``,
        onUpdate: ({ getHTML }) => {
          // get new content on update
          const newContent = getHTML()
          console.log(newContent)
        }
      }),
    }
  },
  watch: {
    'editor.content': {
      handler(val) {
        console.log(val)
      }
    }
  },
  beforeDestroy() {
    this.editor.destroy()

    // this.editor.watch()
  },
}
</script>

<style lang="scss">
.editor {
  p {
    min-height: 300px;
    padding: 4px 12px;
    border: 1px solid #aaa;
    border-radius: 4px;
    &.is-editor-empty {
      &:first-child::before {
        content: attr(data-empty-text);
        float: left;
        color: #aaa;
        pointer-events: none;
        height: 0;
        font-style: italic;
      }
    }
  }
}
.menubar {
  margin-bottom: 6px;
  &__button {
    padding: 4px 8px;
    border: 1px solid transparent;
    border-radius: 4px;
    width: 40px;
    &--isActive {
      border: 1px solid #aaa;
    }
  }
}
</style>
