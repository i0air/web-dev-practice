<script lang="ts" setup>
import { onMounted, reactive } from "vue";

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
  llmchat: { form: { query: "", temperature: 0 } },
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

  if (resp.ok) {
    state.llmchat.result = await resp.text();
  }
}

function handleFiles(payload: Event) {
  const files = (payload.target as HTMLInputElement).files;
  if (files) state.addfiles.form.files = Array.from(files);
}

onMounted(() => {
  list_knowledge_base_name();
});
</script>

<template>
  <div class="python-api-test">
    <div class="api">
      <button @click="list_knowledge_base_name">GET /list_knowledge_base_name</button>
      <div class="result">{{ state.list_knowledge_base_name.result }}</div>
    </div>

    <div>
      <button @click="create_knowledge_base_name">POST /create_knowledge_base_name</button>
      <input type="text" v-model="state.create_knowledge_base_name.form.kbname" placeholder="kbname" />
      <div class="result">{{ state.create_knowledge_base_name.result }}</div>
    </div>

    <div>
      <button @click="delete_knowledge_base_name">DELETE /delete_knowledge_base_name</button>
      <input type="text" v-model="state.delete_knowledge_base_name.form.kbname" placeholder="kbname" />
      <div class="result">{{ state.delete_knowledge_base_name.result }}</div>
    </div>

    <div>
      <button @click="delete_all_knowledge_base_name">DELETE /delete_all_knowledge_base_name</button>
      <div class="result">{{ state.delete_all_knowledge_base_name.result }}</div>
    </div>

    <div>
      <button @click="addfiles">POST /addfiles</button>
      <input type="text" v-model="state.addfiles.form.kbname" placeholder="kbname" />
      <input type="number" v-model="state.addfiles.form.overlap" placeholder="overlap" />
      <input type="number" v-model="state.addfiles.form.chunk" placeholder="chunk" />
      <input type="file" multiple @change="handleFiles" />
      <div class="result">{{ state.addfiles.result }}</div>
    </div>

    <div>
      <button @click="deletefile">DELETE /deletefile</button>
      <input type="text" v-model="state.deletefile.form.kbname" placeholder="kbname" />
      <input type="text" v-model="state.deletefile.form.filename" placeholder="filename" />
      <div class="result">{{ state.deletefile.result }}</div>
    </div>

    <div>
      <button @click="getfiles">GET /getfiles</button>
      <input type="text" v-model="state.getfiles.form.kbname" placeholder="kbname" />
      <div class="result">{{ state.getfiles.result }}</div>
    </div>

    <div>
      <button @click="query">GET /query</button>
      <input type="text" v-model="state.query.form.kbname" placeholder="kbname" />
      <input type="text" v-model="state.query.form.query" placeholder="query" />
      <input type="number" v-model="state.query.form.score" placeholder="score" />
      <input type="number" v-model="state.query.form.topk" placeholder="topk" />
      <input type="number" v-model="state.query.form.temperature" placeholder="temperature" />
      <div class="result">{{ state.query.result }}</div>
    </div>

    <div>
      <button @click="dbchat">GET /dbchat</button>
      <input type="text" v-model="state.dbchat.form.kbname" placeholder="kbname" />
      <input type="text" v-model="state.dbchat.form.query" placeholder="query" />
      <input type="number" v-model="state.dbchat.form.score" placeholder="score" />
      <input type="number" v-model="state.dbchat.form.topk" placeholder="topk" />
      <input type="number" v-model="state.dbchat.form.temperature" placeholder="temperature" />
      <div class="result">{{ state.dbchat.result }}</div>
    </div>

    <div>
      <button @click="llmchat">GET /llmchat</button>
      <input type="text" v-model="state.llmchat.form.query" placeholder="query" />
      <input type="number" v-model="state.llmchat.form.temperature" placeholder="temperature" />
      <div class="result">{{ state.llmchat.result }}</div>
    </div>
  </div>

  <div class="bg"></div>
</template>

<style lang="scss" scoped>
.python-api-test {
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1;

  & > div {
    border-radius: 0.25rem;
    background-color: lightblue;
    padding: 0.5rem;
    min-width: 500px;
    color: black;
    font-size: small;

    span::after {
      content: ": ";
    }

    input {
      margin-right: 0.5rem;
    }

    button {
      margin-right: 1rem;
    }

    .result {
      margin-top: 0.5rem;
      border-radius: 0.25rem;
      background-color: #000000a0;
      padding: 0.5rem;
      min-height: 2rem;
      color: #ffffffc0;
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
