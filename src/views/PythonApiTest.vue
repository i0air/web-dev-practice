<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";

type State = {
  list_knowledge_base_name: { form?: null; result?: string };
  create_knowledge_base_name: { form: { kbname: string }; result?: string };
  delete_knowledge_base_name: { form: { kbname: string }; result?: string };
  delete_all_knowledge_base_name: { form?: null; result?: string };
  addfiles: { form: { kbname: string; overlap: number; chunk: number; files: File[] }; result?: string };
  deletefile: { form: { kbname: string; filename: string }; result?: string };
  getfiles: { form: { kbname: string }; result?: string };
  query: { form: { kbname: string; query: string; score: number; topk: number; temperature: number }; result?: string };
  dbchat: { form: { kbname: string; query: string; score: number; topk: number; temperature: number }; result?: string };
  llmchat: { form: { query: string; temperature: number }; result?: string };
  streamChat: { form: { msg: string }; result?: string };
};

const baseUrl = "/api";

const state = reactive<State>({
  list_knowledge_base_name: {},
  create_knowledge_base_name: { form: { kbname: "" } },
  delete_knowledge_base_name: { form: { kbname: "" } },
  delete_all_knowledge_base_name: {},
  addfiles: { form: { kbname: "", overlap: 64, chunk: 512, files: [] } },
  deletefile: { form: { kbname: "", filename: "" } },
  getfiles: { form: { kbname: "" } },
  query: { form: { kbname: "", query: "", score: 0.5, topk: 10, temperature: 0 } },
  dbchat: { form: { kbname: "", query: "", score: 0.5, topk: 10, temperature: 0 } },
  llmchat: { form: { query: "", temperature: 0 }, result: "" },
  streamChat: { form: { msg: "" } },
});

async function list_knowledge_base_name() {
  const resp = await fetch(baseUrl + "/list_knowledge_base_name", { method: "GET" });

  if (resp.ok) {
    state.list_knowledge_base_name.result = await resp.text();
  }
}

async function create_knowledge_base_name() {
  const resp = await fetch(baseUrl + "/create_knowledge_base_name", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state.create_knowledge_base_name.form),
  });

  if (resp.ok) {
    state.create_knowledge_base_name.result = await resp.text();
  }
}

async function delete_knowledge_base_name() {
  const resp = await fetch(baseUrl + "/delete_knowledge_base_name", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state.delete_knowledge_base_name.form),
  });

  if (resp.ok) {
    state.delete_knowledge_base_name.result = await resp.text();
  }
}

async function delete_all_knowledge_base_name() {
  const resp = await fetch(baseUrl + "/delete_all_knowledge_base_name", { method: "DELETE" });

  if (resp.ok) {
    state.delete_all_knowledge_base_name.result = await resp.text();
  }
}

async function addfiles() {
  const url = `${baseUrl}/addfiles?kbname=${state.addfiles.form.kbname}&overlap=${state.addfiles.form.overlap}&chunk=${state.addfiles.form.chunk}`;
  const formData = new FormData();
  for (const file of state.addfiles.form.files) {
    formData.append("files", file);
  }

  const resp = await fetch(url, { method: "POST", body: formData });

  if (resp.ok) {
    state.addfiles.result = await resp.text();
  }
}

async function deletefile() {
  const resp = await fetch(baseUrl + "/deletefile", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(state.deletefile.form),
  });

  if (resp.ok) {
    state.deletefile.result = await resp.text();
  }
}

async function getfiles() {
  const resp = await fetch(baseUrl + "/getfiles?kbname=" + state.getfiles.form.kbname, { method: "GET" });

  if (resp.ok) {
    state.getfiles.result = await resp.text();
  }
}

async function query() {
  const url = `${baseUrl}/query?kbname=${state.query.form.kbname}&query=${state.query.form.query}&score=${state.query.form.score}&topk=${state.query.form.topk}&temperature=${state.query.form.temperature}`;
  const resp = await fetch(url, { method: "GET" });

  if (resp.ok) {
    state.query.result = await resp.text();
  }
}

async function dbchat() {
  const url = `${baseUrl}/dbchat?kbname=${state.dbchat.form.kbname}&query=${state.dbchat.form.query}&score=${state.dbchat.form.score}&topk=${state.dbchat.form.topk}&temperature=${state.dbchat.form.temperature}`;
  const resp = await fetch(url, { method: "GET" });

  if (resp.ok) {
    state.dbchat.result = await resp.text();
  }
}

async function llmchat() {
  const url = `${baseUrl}/llmchat?query=${state.llmchat.form.query}&temperature=${state.llmchat.form.temperature}`;
  const resp = await fetch(url, { method: "GET" });
  const reader = resp.body!.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const decoder = new TextDecoder();
    const chunk = decoder.decode(value);
    state.llmchat.result += handleChatChunk(chunk);
  }
}

async function streamChat() {
  // 会话编号，注意每次开启新的对话，需要使用新的不重复的编号
  const hash = "nsolg1urksq";

  // 1.建立心跳，打开对话页面时调用一次即可
  const urlhb = "http://192.168.50.103:9997/qwen2.5-instruct/gradio_api/heartbeat/" + hash;
  fetch(urlhb);

  // 2.发送消息，建立会话
  const urlReq = "http://192.168.50.103:9997/qwen2.5-instruct/gradio_api/run/predict";
  await fetch(urlReq, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: [state.streamChat.form.msg, []], event_data: null, fn_index: 0, trigger_id: 9, session_hash: hash }),
  });

  // 3.加入会话
  const urlJoin = "http://192.168.50.103:9997/qwen2.5-instruct/gradio_api/queue/join";
  await fetch(urlJoin, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      data: [null, [[state.streamChat.form.msg, null]], 512, 1, ""],
      event_data: null,
      fn_index: 2,
      trigger_id: 9,
      session_hash: hash,
    }),
  });

  // 4.获取对话结果
  const urlResp = "http://192.168.50.103:9997/qwen2.5-instruct/gradio_api/queue/data?session_hash=" + hash;
  const eventSource = new EventSource(urlResp);
  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.msg) {
      case "process_generating":
        const output: string[] = data.output.data[0][0];
        if (output) {
          if (output[0] !== "append") {
            state.streamChat.result = output[0] + "\n\n";
          } else {
            state.streamChat.result += output[2];
          }
        }
        break;
      case "process_completed":
        console.log("process_completed", data.output.data[0][0]);
        break;
      default:
        console.log(data.msg);
        break;
    }
  };
}

function handleFiles(payload: Event) {
  const files = (payload.target as HTMLInputElement).files;
  if (files) state.addfiles.form.files = Array.from(files);
}

function handleChatChunk(chunk: string) {
  const lines = chunk.split("\n");
  let result = "";
  for (const line of lines) {
    const json = `{${line.replace("0:", '"0":')}}`;
    const data = JSON.parse(json);
    if (data[0]) result += data[0];
  }
  return result;
}

onMounted(() => {
  list_knowledge_base_name();
});
</script>

<template>
  <div class="python-api-test">
    <div class="api">
      <button @click="list_knowledge_base_name">GET /list_knowledge_base_name</button>
      <div class="result">
        <textarea v-model="state.list_knowledge_base_name.result"></textarea>
      </div>
    </div>

    <div>
      <button @click="create_knowledge_base_name">POST /create_knowledge_base_name</button>
      <div class="form">
        <input type="text" v-model="state.create_knowledge_base_name.form.kbname" placeholder="kbname" />
      </div>
      <div class="result">
        <textarea v-model="state.create_knowledge_base_name.result"></textarea>
      </div>
    </div>

    <div>
      <button @click="delete_knowledge_base_name">DELETE /delete_knowledge_base_name</button>
      <div class="form">
        <input type="text" v-model="state.delete_knowledge_base_name.form.kbname" placeholder="kbname" />
      </div>
      <div class="result">
        <textarea v-model="state.delete_knowledge_base_name.result"></textarea>
      </div>
    </div>

    <div>
      <button @click="delete_all_knowledge_base_name">DELETE /delete_all_knowledge_base_name</button>
      <div class="result">
        <textarea name="" id="" v-model="state.delete_all_knowledge_base_name.result"></textarea>
      </div>
    </div>

    <div>
      <button @click="addfiles">POST /addfiles</button>
      <div class="form">
        <input type="text" v-model="state.addfiles.form.kbname" placeholder="kbname" />
        <input type="number" v-model="state.addfiles.form.overlap" placeholder="overlap" />
        <input type="number" v-model="state.addfiles.form.chunk" placeholder="chunk" />
        <input type="file" multiple @change="handleFiles" title="请选择多个文本文件" />
      </div>
      <div class="result">
        <textarea name="" id="" v-model="state.addfiles.result"></textarea>
      </div>
    </div>

    <div>
      <button @click="deletefile">DELETE /deletefile</button>
      <div class="form">
        <input type="text" v-model="state.deletefile.form.kbname" placeholder="kbname" />
        <input type="text" v-model="state.deletefile.form.filename" placeholder="filename" />
      </div>
      <div class="result">
        <textarea name="" id="" v-model="state.deletefile.result"></textarea>
      </div>
    </div>

    <div>
      <button @click="getfiles">GET /getfiles</button>
      <div class="form">
        <input type="text" v-model="state.getfiles.form.kbname" placeholder="kbname" />
      </div>
      <div class="result">
        <textarea name="" id="" v-model="state.getfiles.result"></textarea>
      </div>
    </div>

    <div>
      <button @click="query">GET /query</button>
      <div class="form">
        <input type="text" v-model="state.query.form.kbname" placeholder="kbname" />
        <input type="text" v-model="state.query.form.query" placeholder="query" />
        <input type="number" v-model="state.query.form.score" placeholder="score" />
        <input type="number" v-model="state.query.form.topk" placeholder="topk" />
        <input type="number" v-model="state.query.form.temperature" placeholder="temperature" />
      </div>
      <div class="result">
        <textarea name="" id="" v-model="state.query.result"></textarea>
      </div>
    </div>

    <div>
      <button @click="dbchat">GET /dbchat</button>
      <div class="form">
        <input type="text" v-model="state.dbchat.form.kbname" placeholder="kbname" />
        <input type="text" v-model="state.dbchat.form.query" placeholder="query" />
        <input type="number" v-model="state.dbchat.form.score" placeholder="score" />
        <input type="number" v-model="state.dbchat.form.topk" placeholder="topk" />
        <input type="number" v-model="state.dbchat.form.temperature" placeholder="temperature" />
      </div>
      <div class="result">
        <textarea name="" id="" v-model="state.dbchat.result"></textarea>
      </div>
    </div>

    <div>
      <button @click="llmchat">GET /llmchat</button>
      <div class="form">
        <input type="text" v-model="state.llmchat.form.query" placeholder="query" />
        <input type="number" v-model="state.llmchat.form.temperature" placeholder="temperature" />
      </div>
      <div class="result">
        <textarea name="" id="" rows="10" cols="100" v-model="state.llmchat.result"></textarea>
      </div>
    </div>

    <div>
      <button @click="streamChat">POST /streamChat</button>
      <div class="form">
        <input type="text" v-model="state.streamChat.form.msg" placeholder="msg" />
      </div>
      <div class="result">
        <textarea v-model="state.streamChat.result"></textarea>
      </div>
    </div>
  </div>

  <div class="bg"></div>
</template>

<style lang="scss" scoped>
.python-api-test {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  z-index: 1;
  overflow: auto;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 0.25rem;
    background-color: lightblue;
    padding: 0.5rem;
    min-width: 470px;
    color: black;
    font-size: small;

    button {
      cursor: pointer;
      outline: none;
      box-shadow: 0 0 0.25rem #000000a0 inset;
      border: none;
      border-radius: 0.25rem;
      background-color: #ffffffa0;
      padding: 0.25rem 0.5rem;
    }

    .form {
      display: flex;
      align-items: center;
      gap: 5px;

      input {
        outline: none;
        box-shadow: 0 0 0.25rem #000000a0 inset;
        border: none;
        border-radius: 0.25rem;
        background-color: #ffffffa0;
        padding: 0.25rem 0.5rem;
        height: 1.5rem;

        &::file-selector-button {
          border: none;
          background-color: transparent;
          padding: 0;
          color: inherit;
          font-size: small;
        }
      }
    }

    .result {
      flex: auto;
      border-radius: 0.25rem;
      background-color: #000000a0;
      padding: 0.5rem;
      min-height: 2rem;
      color: #ffffffa0;

      textarea {
        outline: none;
        border: none;
        background-color: transparent;
        width: 100%;
        height: 100%;
        resize: none;
        color: inherit;
      }
    }
  }
}

.bg {
  position: fixed;
  top: 0;
  left: 0;
  animation: gradient 15s ease infinite;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  width: 100vw;
  height: 100vh;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
