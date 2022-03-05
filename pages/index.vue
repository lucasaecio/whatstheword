<template>
  <section class="text-white">
    <header class="d-flex justify-content-center background__header py-3">
      <input :type="solutionWordInputType" v-model="solutionWord" />
      <button class="custom-btn" @click="switchVisibility">
        {{ labelWordInput }} resposta
      </button>
    </header>
    <div class="container d-flex flex-column align-items-center mt-4">
      <section v-if="attempts.length > 0" class="mb-2 attempt-section">
        <div
          v-for="(attempt, index) in attempts"
          :key="'attempt_' + index"
          class="mt-2"
        >
          <div
            v-for="(letter, index) in attempt"
            :key="'letter_' + index + letter"
            class="letter-attempt-box"
            :class="{
              'correct-position-letter': letter.correctPosition,
              'has-letter': letter.hasLetter,
            }"
          >
            {{ letter.value }}
          </div>
        </div>
      </section>
      <div
        v-if="!hasCorrectResponse"
        class="input__section"
        @keyup="submitResponse"
      >
        <input
          class="text-box"
          type="text"
          maxlength="1"
          tabindex="1"
          ref="input"
          v-model="currentAttempt.letter_1.value"
          @keyup="autoTabInput"
        />
        <input
          class="text-box"
          type="text"
          maxlength="1"
          tabindex="2"
          ref="input"
          v-model="currentAttempt.letter_2.value"
          @keyup="autoTabInput"
        />
        <input
          class="text-box"
          type="text"
          maxlength="1"
          tabindex="3"
          ref="input"
          v-model="currentAttempt.letter_3.value"
          @keyup="autoTabInput"
        />
        <input
          class="text-box"
          type="text"
          maxlength="1"
          tabindex="4"
          ref="input"
          v-model="currentAttempt.letter_4.value"
          @keyup="autoTabInput"
        />
        <input
          class="text-box"
          type="text"
          maxlength="1"
          tabindex="5"
          ref="input"
          v-model="currentAttempt.letter_5.value"
          @keyup="autoTabInput"
        />
      </div>
      <div class="congratulations-section mt-5" v-else>
        <img src="@/assets/img/congratulations.svg" alt="" />
        <p>Parabéns, Você acertou!</p>
        <button class="custom-btn" @click="restartGame">Reiniciar</button>
      </div>
    </div>
  </section>
</template>

<script>
import words from "@/assets/json/words.json";
import defaultAttemptObject from "@/assets/json/defaultAttemptObject.json";

export default {
  name: "IndexPage",
  data() {
    return {
      words: words,
      solutionWord: "",
      explodedSolutionWord: [],
      currentAttempt: {},
      attempts: [],
      hasCorrectResponse: false,
      labelWordInput: "Exibir",
      solutionWordInputType: "password",
    };
  },
  computed: {
    hasCompletedAttempt() {
      let response = true;

      Object.values(this.currentAttempt).forEach((item, index) => {
        if (!item.value.trim()) {
          return (response = false);
        }
      });

      return response;
    },
  },
  methods: {
    switchVisibility() {
      if (this.solutionWordInputType === "password") {
        this.solutionWordInputType = "text";
        this.labelWordInput = "Esconder";
      } else {
        this.solutionWordInputType = "password";
        this.labelWordInput = "Exibir";
      }
    },
    focusFirstInput() {
      document.querySelector("div.input__section input:first-child").focus();
    },
    computeAttempt(attempt) {
      this.attempts.push(JSON.parse(JSON.stringify(attempt)));
    },
    autoTabInput(event) {
      if (event.code != "Backspace") {
        if (!event.target.nextElementSibling) {
          return false;
        }

        return event.target.nextElementSibling.focus();
      }

      if (!event.target.previousElementSibling) {
        return false;
      }

      return event.target.previousElementSibling.focus();
    },

    submitResponse(event) {
      if (
        event.target.nextElementSibling ||
        event.code != "Enter" ||
        !this.hasCompletedAttempt
      ) {
        return false;
      }

      this.validateAttemptSolution();
    },
    explodeSolutionWord() {
      this.explodedSolutionWord = this.solutionWord.split("");
    },
    validateAttemptSolution() {
      let hasCorrectResponse = true;

      Object.keys(this.currentAttempt).forEach((item, index) => {
        let letterAttempt = this.currentAttempt[item].value;

        if (this.explodedSolutionWord.includes(letterAttempt)) {
          this.currentAttempt[item].hasLetter = true;

          if (this.explodedSolutionWord[index] === letterAttempt) {
            this.currentAttempt[item].correctPosition = true;
          }
        }

        if (!this.currentAttempt[item].correctPosition) {
          hasCorrectResponse = false;
        }
      });

      this.hasCorrectResponse = hasCorrectResponse;

      this.computeAttempt(this.currentAttempt);
      this.clearCurrentAttempt();
      this.focusFirstInput();
    },

    clearCurrentAttempt() {
      this.currentAttempt = JSON.parse(JSON.stringify(defaultAttemptObject));
    },
    restartGame() {
      this.attempts = [];
      this.hasCorrectResponse = false;
      this.clearCurrentAttempt();
      this.chooseRandomWord();

      this.labelWordInput = "Exibir";
      this.solutionWordInputType = "password";
    },
    chooseRandomWord() {
      let arrayWordsLength = this.words.five.length;
      this.solutionWord =
        this.words.five[Math.floor(Math.random() * arrayWordsLength)];

      this.explodeSolutionWord();
    },
  },
  mounted() {
    this.explodeSolutionWord();
  },
  created() {
    this.chooseRandomWord();

    this.clearCurrentAttempt();
  },
};
</script>

<style>
@import "@/assets/css/indexPage.css";
</style>
