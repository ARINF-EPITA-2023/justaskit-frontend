<template>
  <div>
    <b-button-toolbar class="top-bar" justify="justify">
      <b-button-group class="mx-1" size="sm" style="max-width: fit-content">
        <b-button size="sm" variant="outline-primary" class="btn" v-b-modal.modal-1>Add</b-button>
        <b-button size="sm" variant="outline-primary" class="btn" @click="deleteQuestion">Remove</b-button>
      </b-button-group>
      <b-button-group class="mx-1" size="sm" style="max-width: fit-content">
        <b-button size="sm" variant="outline-primary" class="btn" @click="upvote">Upvote</b-button>
        <b-button size="sm" variant="outline-primary" class="btn" @click="downvote">Downvote</b-button>
      </b-button-group>
    </b-button-toolbar>
    <div class="content">

      <div class="centered">
        <h1>JustAskIt</h1>
        <h2>{{ questions[index].question_text }}</h2>
        <div class="buttons">
          <div class="response">
            <b-button variant="success" @click="vote(0)">{{ questions[index].response1.response_text }}</b-button>
            <div v-show="voted" class="my-4">Choisi par {{ questions[index].response1.choice }} personnes</div>
          </div>
          <div class="response">
            <b-button variant="danger" @click="vote(1)">{{ questions[index].response2.response_text }}</b-button>
            <div v-show="voted" class="my-4">Choisi par {{ questions[index].response2.choice }} personnes</div>
          </div>
        </div>
      </div>
      <b-button variant="success" @click="increaseIndex()">Next</b-button>


      <b-modal id="modal-1" centered hide-footer title="Create Question">
        <b-form @submit="onSubmit" @reset="onReset">
          <b-form-group
            id="input-group-1"
            label="Question:"
            label-for="input-1"
          >
            <b-form-input
              id="input-1"
              v-model="form.question"
              type="text"
              placeholder="Enter question"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-2" label="The first choice" label-for="input-2">
            <b-form-input
              id="input-2"
              v-model="form.response1"
              placeholder="Enter choice"
              required
            ></b-form-input>
          </b-form-group>

          <b-form-group id="input-group-3" label="The second choice" label-for="input-3">
            <b-form-input
              id="input-3"
              v-model="form.response2"
              placeholder="Enter choice"
              required
            ></b-form-input>
          </b-form-group>

          <b-button type="submit" class="mt-3" variant="outline-primary">Submit</b-button>
          <b-button type="reset" class="mt-3" variant="outline-danger">Reset</b-button>
        </b-form>
      </b-modal>

    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { NewQuestionType } from "~/utils/type/NewQuestionType";
import { QuestionType } from "~/utils/type/QuestionType";

export default Vue.extend({
  name: "IndexPage",
  async asyncData({}) {
    console.log(`${process.env.baseUrl}/api/questions`);
    const response = await fetch(`${process.env.baseUrl}/api/questions`,
      {
        method: "GET"
      });
    const questions: QuestionType[] = await response.json();
    return { questions };
  },
  data() {
    return {
      form: {
        question: "",
        response1: "",
        response2: ""
      },
      questions: [] as QuestionType[],
      index: 0,
      voted: false
    };
  },
  methods: {
    onSubmit() {
      const question: NewQuestionType = {
        question_text: this.form.question,
        response1: {
          response_text: this.form.response1
        },
        response2: {
          response_text: this.form.response2
        }
      };
      fetch(`${process.env.baseUrl}/api/questions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(question)
      }).then((response) => {
        return response.json();
      }).then((data: QuestionType) => {
        this.questions.push(data);
        console.log(data);
      });
    },
    onReset() {
      this.form.question = "";
      this.form.response1 = "";
      this.form.response2 = "";
      this.$bvModal.hide('modal-1')
    },
    increaseIndex() {
      this.index++;
      if (this.index >= this.questions.length) {
        this.index = 0;
      }
      this.voted = false;
    },
    upvote() {
      this.questions[this.index].upvote++;
      fetch(`${process.env.baseUrl}/api/questions/${this.questions[this.index].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.questions[this.index])
      });
    },
    downvote() {
      this.questions[this.index].downvote++;
      fetch(`${process.env.baseUrl}/api/questions/${this.questions[this.index].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.questions[this.index])
      });
    },
    deleteQuestion() {
      if (this.questions[this.index].downvote > this.questions[this.index].upvote) {
        fetch(`${process.env.baseUrl}/api/questions/${this.questions[this.index].id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(this.questions[this.index])
        });
        this.questions.splice(this.index, 1);
      }
    },
    vote(response: number) {
      if (this.voted) {
        return;
      }
      this.voted = true;
      if (response === 0) {
        this.questions[this.index].response1.choice++;
      } else {
        this.questions[this.index].response2.choice++;
      }
      fetch(`${process.env.baseUrl}/api/questions/${this.questions[this.index].id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(response)
      });
    }
  }
});
</script>
<style lang="scss">
@import "app";


.buttons {
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;
  height: auto;
  gap: 5vw;
  justify-content: space-between;
}

.top-bar {
  height: auto;
  width: 100%;
  padding: 1rem;
}

body {
  font-weight: lighter;
}

h1 {
  color: $primary;
  font-weight: bolder;
}

.btn {
  max-width: fit-content;
  padding: 5px;
}

.response {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}


.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 25px;

}
</style>
