<template>
  <div class="blog-editor">
    <div class="form-item">
      <label for="title">标题：</label>
      <input v-model="title" type="text" placeholder="请输入标题" class="input" />
    </div>
    <div class="form-item">
      <label for="title">分类：</label>
      <input
        v-model="categories"
        type="text"
        placeholder="请输入分类，多个用逗号隔开"
        class="input"
      />
    </div>
    <div class="form-item">
      <label for="title">标签：</label>
      <input
        v-model="tags"
        type="text"
        placeholder="请输入标签，多个用逗号隔开"
        class="input"
      />
    </div>
    <div class="form-item">
      <label for="title">内容：</label>
      <v-md-editor
        v-model="content"
        height="400px"
        placeholder="请输入内容"
        right-toolbar="preview sync-scroll fullscreen"
      >
      </v-md-editor>
    </div>
    <div class="controls">
      <button @click="saveBlog">保存</button>
    </div>
  </div>
</template>

<script>
import VMdEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";
import hljs from "highlight.js";
import { Base64 } from 'js-base64';
import githubToken from "../../../utils";

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});

export default {
  components: {
    "v-md-editor": VMdEditor,
  },
  data() {
    return {
      content: "",
      title: "",
      categories: "",
      tags: "",
      clicked: false,
    };
  },
  mounted() {
    this.hideTitle();
    this.hideComment();
  },
  methods: {
    hideTitle() {
      const ele = document.querySelector(".page-title");
      ele.style.display = "none";
    },
    // 隐藏评论
    hideComment() {
      const ele = document.querySelector(".comments-wrapper");
      ele.style.display = "none";
    },
    formatString(input) {
      // 检查输入是否为空或无效
      if (typeof input !== "string" || input.trim() === "") {
        return "";
      }

      // 分割字符串
      const items = input.split(",").map((item) => item.trim());

      // 生成格式化的字符串
      const formattedItems = items.map((item) => ` - ${item}`).join("\n");

      return formattedItems;
    },
    utf8ToBase64(str) {
      // 使用 TextEncoder 将字符串转换为 UTF-8 编码的字节数组
      const encoder = new TextEncoder();
      const uint8Array = encoder.encode(str);

      // 将 Uint8Array 转换为二进制字符串
      let binaryString = "";
      for (let i = 0; i < uint8Array.length; i++) {
        binaryString += String.fromCharCode(uint8Array[i]);
      }
      // 使用 btoa 进行 Base64 编码
      return Base64.btoa(binaryString);
    },
    async saveBlog() {
      if (this.clicked) return;
      if (!this.title || !this.content) {
        alert("请输入标题和内容！");
        return;
      }
      this.clicked = true;

      const d = new Date();
      const time = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      const blogData = `---
title: ${this.title}
date: ${time}
categories:
${this.formatString(this.categories)}
tags:
${this.formatString(this.tags)}
---

${this.content}
`;
      console.log("blogData:", blogData);

      try {
        const response = await fetch(
          `https://api.github.com/repos/chengzhnag/chengzhnag.github.io/contents/docs/collect/${time}-${new Date().getTime()}.md`,
          {
            method: "PUT",
            headers: {
              Authorization: `token ${githubToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Add blog post: ${this.title}`,
              content: this.utf8ToBase64(blogData),
              branch: "master",
            }),
          }
        );

        if (response.ok) {
          alert("保存成功，请耐心等待重新构建！");
        } else {
          alert("报错失败，出错了");
        }
        this.clicked = false;
      } catch (error) {
        this.clicked = false;
        console.error("Error saving blog:", error);
        alert("An error occurred while saving the blog.");
      }
    },
  },
};
</script>

<style scoped>
.blog-editor {
}

.editor {
  margin-bottom: 20px;
}

.controls {
  display: flex;
  align-items: center;
}
.form-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}
.form-item label {
  font-size: 16px;
  color: #222;
  margin-bottom: 4px;
}

.input {
  margin-right: 10px;
  padding: 8px 5px;
  width: 100%;
  border: 1px solid #ccc !important;
  border-radius: 4px !important;
}

button {
  padding: 10px 20px;
  background-color: #3eaf7c;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #389466;
}
</style>
