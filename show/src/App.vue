<template>
  <div id="app">
    <el-form
      ref="form"
      :rules="rules"
      :model="form"
      :label-position="labelPosition"
      :label-width="widthStr"
    >
      <el-form-item label="标题" prop="title">
        <el-input placeholder="请输入标题" v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="categories">
        <el-input
          placeholder="请输入分类，用逗号隔开"
          v-model="form.categories"
        ></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="tags">
        <el-input
          placeholder="请输入标签，用逗号隔开"
          v-model="form.tags"
        ></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <v-md-editor v-model="form.content" :height="mdHeight"></v-md-editor>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message, Loading } from "element-ui";
import axios from "axios";
export default {
  name: "app",
  data() {
    return {
      form: {
        title: "",
        categories: "",
        tags: "",
        content: "",
      },
      widthStr: "80px",
      mdHeight: "400px",
      labelPosition: "right",
      screenWidth: document.body.clientWidth,
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "change" }],
        categories: [
          { required: true, message: "请输入分类", trigger: "change" },
        ],
        tags: [{ required: true, message: "请输入标签", trigger: "change" }],
        content: [{ required: true, message: "请输入内容", trigger: "change" }],
      },
    };
  },
  watch: {
    "form.content"(newVal, oldVal) {
      console.log(newVal, oldVal);
      this.$refs["form"].validateField("content");
    },
    screenWidth(newVal, oldVal) {
      console.log(newVal, oldVal);
      this.check(newVal);
    },
  },
  mounted() {
    window.onresize = () => {
      console.log("window.onresize");
      return (() => {
        window.screenWidth = document.body.clientWidth;
        this.screenWidth = window.screenWidth;
        console.log(document.body.clientWidth);
      })();
    };
    this.check(this.screenWidth);
  },
  methods: {
    check(newVal) {
      if (newVal >= 320 && newVal <= 768) {
        this.widthStr = "55px";
        this.mdHeight = "680px";
        this.labelPosition = "top";
      } else {
        this.widthStr = "80px";
        this.mdHeight = "500px";
        this.labelPosition = "right";
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let loadingInstance = Loading.service({
            lock: true,
            text: "保存中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          const params = { ...this.form };
          params.categories = params.categories.replace(/，/g, ',');
          params.tags = params.tags.replace(/，/g, ',');
          axios
            .post("http://192.168.245.1:3000/record", params)
            .then((res) => {
              console.log("res:", res);
              loadingInstance.close();
              if (res.data.code === 1) {
                Message.success("保存成功");
                this.$refs["form"].resetFields();
              } else {
                Message.error(res.data.errMessage);
              }
            })
            .catch((err) => {
              console.log("err:", err);
              Message.error(err.message || err);
              loadingInstance.close();
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style>
@media (min-width: 320px) and (max-width: 768px) {
  .el-message {
    max-width: 60% !important;
    min-width: 60% !important;
  }
  .CodeMirror-linenumbers {
    width: 15px !important;
  }
  .CodeMirror-linenumber {
    width: 15px !important;
    left: -7px !important;
  }
  .v-md-editor__main {
    flex-direction: column;
  }
  .v-md-editor__editor-wrapper {
    border-bottom: 1px solid #ddd;
    border-left: 1px solid #ddd;
  }
  .v-md-editor__preview-wrapper {
    border: 1px solid #ddd;
    border-top: none;
  }
}
</style>
