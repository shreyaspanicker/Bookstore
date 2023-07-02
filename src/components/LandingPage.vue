<template>
  <div class="section" @click="closeDropDown = !isClosed ? true : false">
    <div id="modal-container" @click="closeModal">
      <div class="modal-background">
        <div class="modal" v-if="Object.keys(book).length">
          <div class="book-image">
            <img
              :src="getImagePath"
              style="width: 150px; height: 200px"
              alt=""
            />
          </div>
          <div class="book-details" v-if="Object.keys(book).length">
            <div class="relevant-info">
              <div class="book-title">
                {{ book.volumeInfo.title }}
              </div>
              <div v-if="book.volumeInfo.subtitle">
                {{ book.volumeInfo.subtitle }}
              </div>
              <hr />
              <div
                class="book-authors"
                v-if="
                  book.volumeInfo.authors &&
                  book.volumeInfo.authors.length !== 0
                "
              >
                By:
                <span
                  v-for="(author, index) in book.volumeInfo.authors"
                  :key="`${index}_${book.volumeInfo.contentVersion}`"
                >
                  {{ author
                  }}<span v-show="index + 1 !== book.volumeInfo.authors.length"
                    >,</span
                  >
                </span>
              </div>
              <span
                class="rating-container"
                :id="`r-${book.id}`"
                v-if="book.volumeInfo.averageRating"
              >
                <span class="average-rating">{{
                  book.volumeInfo.averageRating
                }}</span>
                <span class="rating-star"></span>
              </span>
              <span class="rating-count" v-if="book.volumeInfo.ratingsCount"
                >{{ book.volumeInfo.ratingsCount }} rating<span
                  v-if="parseInt(book.volumeInfo.ratingsCount) !== 1"
                  >s</span
                ></span
              >
              <span class="rating-count" v-else>No ratings yet</span>
              <div class="book-price" v-if="book.saleInfo.retailPrice">
                {{ getCurrencySymbol }}{{ book.saleInfo.retailPrice.amount }}
              </div>
              <div class="use-book" @click="actionOnBooks">
                <span class="buy-link" v-if="book.saleInfo.buyLink"
                  >Buy<uil-shopping-cart-alt
                    size="30px"
                    class="logo"
                  ></uil-shopping-cart-alt
                ></span>
                <span
                  class="download-link"
                  v-if="
                    book.accessInfo.pdf.isAvailable &&
                    book.accessInfo.pdf.downloadLink
                  "
                  >Download
                  <uil-file-download
                    size="30px"
                    class="logo"
                  ></uil-file-download>
                </span>
              </div>
            </div>
          </div>
          <div class="additional-info specs">
            <div class="title">Specifications</div>
            <hr />
            <table>
              <tr v-if="book.volumeInfo.publishedDate">
                <td>Published In</td>
                <td>{{ getDate }}</td>
              </tr>
              <tr v-if="book.volumeInfo.publisher">
                <td>Publisher</td>
                <td>{{ book.volumeInfo.publisher }}</td>
              </tr>
              <tr v-if="book.volumeInfo.pageCount">
                <td>Number Of Pages</td>
                <td>{{ book.volumeInfo.pageCount }}</td>
              </tr>
              <tr>
                <td>Language</td>
                <td>{{ getLanguage }}</td>
              </tr>
            </table>
          </div>
          <div class="additional-info description">
            <div class="title">Description</div>
            <hr />
            {{
              book.volumeInfo.description
                ? book.volumeInfo.description
                : "No description available"
            }}
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <nav>
        <header-section :header="header" />
        <search-box
          @isDropDownClosed="closeDropDownIfOpen"
          @searched="(params) => (searchParams = params)"
          :closeDropDown="closeDropDown"
        />
      </nav>
      <display-books :searchParams="searchParams" @bookClicked="showDetails" />
    </div>
  </div>
</template>

<script>
import HeaderSection from "./HeaderSection.vue";
import SearchBox from "./SearchBox.vue";
import DisplayBooks from "./DisplayBooks.vue";
import { UilShoppingCartAlt } from "@iconscout/vue-unicons";
import { UilFileDownload } from "@iconscout/vue-unicons";
import data from "../utils/data.json";

export default {
  name: "LandingPage",
  data() {
    return {
      book: {},
      modalContainer: null,
      searchParams: {
        category: data.categories[0].value,
        keywords: [],
      },
      isModalOpened: false,
      isClosed: true,
      closeDropDown: false,
      previousAnimationType: null,
      animationTypes: ["one", "two", "three", "four", "five"],
      currencySymbols: {
        USD: "$", // US Dollar
        EUR: "€", // Euro
        CRC: "₡", // Costa Rican Colón
        GBP: "£", // British Pound Sterling
        ILS: "₪", // Israeli New Sheqel
        INR: "₹", // Indian Rupee
        JPY: "¥", // Japanese Yen
        KRW: "₩", // South Korean Won
        NGN: "₦", // Nigerian Naira
        PHP: "₱", // Philippine Peso
        PLN: "zł", // Polish Zloty
        PYG: "₲", // Paraguayan Guarani
        THB: "฿", // Thai Baht
        UAH: "₴", // Ukrainian Hryvnia
        VND: "₫", // Vietnamese Dong
      },
    };
  },
  computed: {
    getImagePath() {
      return this.book?.volumeInfo?.imageLinks?.thumbnail
        ? this.book.volumeInfo.imageLinks.thumbnail
        : "images/no-preview.png";
    },
    getDate() {
      const date = new Date(this.book.volumeInfo.publishedDate);
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      return month + " " + year;
    },
    getCurrencySymbol() {
      return this.currencySymbols?.[
        this.book.saleInfo.retailPrice.currencyCode
      ];
    },
    getLanguage() {
      let languageNames = new Intl.DisplayNames(["en"], { type: "language" });
      return languageNames.of(this.book.volumeInfo.language);
    },
  },
  components: {
    SearchBox,
    HeaderSection,
    DisplayBooks,
    UilShoppingCartAlt,
    UilFileDownload,
  },
  props: {
    header: Object,
  },
  mounted() {
    this.modalContainer = document.getElementById("modal-container");
    window.addEventListener("popstate", this.closeModal);
    window.addEventListener("keydown", this.handleKeydown);
  },
  beforeDestroy() {
    window.removeEventListener("popstate", this.closeModal);
    window.removeEventListener("keydown", this.handleKeydown);
  },
  methods: {
    handleKeydown(event) {
      if (event.key === "Escape" && this.isModalOpened) {
        this.closeModal(event);
      }
    },
    actionOnBooks(event) {
      const className = event.target.className;
      switch (className) {
        case "buy-link":
          window.open(this.book.saleInfo.buyLink, "_blank");
          break;
        case "download-link":
          window.open(this.book.accessInfo.pdf.downloadLink, "_blank").focus();
          break;
        default:
          return;
      }
    },
    showDetails(id, books) {
      this.book = books.find((book) => book.id === id);
      this.$nextTick(() => {
        this.openModal();
      });
    },
    openModal() {
      this.modalContainer.removeAttribute("class");
      // this.modalContainer.classList.add(this.selectAnimation());
      this.modalContainer.classList.add("two");
      document.body.classList.add("modal-active");
      history.pushState(null, null, "");
      this.isModalOpened = true;
    },
    closeModal(event) {
      if (
        event.target.className === "modal-background" ||
        event.target.className === "modal-active"
      ) {
        this.modalContainer.classList.add("out");
        document.body.classList.remove("modal-active");
        this.isModalOpened = false;
      }
      history.back();
    },
    selectAnimation() {
      let randomSelection;
      do {
        randomSelection = Math.floor(
          Math.random() * this.animationTypes.length
        );
      } while (randomSelection === this.previousAnimationType);
      this.previousAnimationType = randomSelection;
      return this.animationTypes[randomSelection];
    },
    closeDropDownIfOpen(value) {
      this.isClosed = value;
      this.closeDropDown = false;
    },
  },
};
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
}

html,
body {
  min-height: 100%;
  height: 100%;
  // background-position: top center;
  &.modal-active {
    overflow: hidden;
  }
}

hr {
  border: 0;
  height: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
}

#modal-container {
  position: fixed;
  display: table;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  transform: scale(0);
  z-index: 1;
  &.one {
    transform: scaleY(0.01) scaleX(0);
    animation: unfoldIn 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    .modal-background {
      .modal {
        transform: scale(0);
        animation: zoomIn 0.5s 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
      }
    }
    &.out {
      transform: scale(1);
      animation: unfoldOut 1s 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
      .modal-background {
        .modal {
          animation: zoomOut 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
      }
    }
  }
  &.two {
    transform: scale(1);
    .modal-background {
      background: rgba(0, 0, 0, 0);
      animation: fadeIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
      .modal {
        opacity: 0;
        animation: scaleUp 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
      }
    }
    + .content {
      animation: scaleBack 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    }
    &.out {
      animation: quickScaleDown 0s 0.5s linear forwards;
      .modal-background {
        animation: fadeOut 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        .modal {
          animation: scaleDown 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
      }
      + .content {
        animation: scaleForward 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
      }
    }
  }
  &.three {
    z-index: 0;
    transform: scale(1);
    .modal-background {
      background: rgba(0, 0, 0, 0.6);
      .modal {
        animation: moveUp 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
      }
    }
    + .content {
      z-index: 1;
      animation: slideUpLarge 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    }
    &.out {
      .modal-background {
        .modal {
          animation: moveDown 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        }
      }
      + .content {
        animation: slideDownLarge 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)
          forwards;
      }
    }
  }
  &.four {
    z-index: 0;
    transform: scale(1);
    .modal-background {
      background: rgba(0, 0, 0, 0.7);
      .modal {
        animation: blowUpModal 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
      }
    }
    + .content {
      z-index: 1;
      animation: blowUpContent 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
    }
    &.out {
      .modal-background {
        .modal {
          animation: blowUpModalTwo 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)
            forwards;
        }
      }
      + .content {
        animation: blowUpContentTwo 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)
          forwards;
      }
    }
  }
  &.five {
    transform: scale(1);
    .modal-background {
      background: rgba(0, 0, 0, 0);
      animation: fadeIn 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
      .modal {
        transform: translateX(-1500px);
        animation: roadRunnerIn 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
      }
    }
    &.out {
      animation: quickScaleDown 0s 0.5s linear forwards;
      .modal-background {
        animation: fadeOut 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
        .modal {
          animation: roadRunnerOut 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)
            forwards;
        }
      }
    }
  }
  .modal-background {
    display: table-cell;
    background: rgba(0, 0, 0, 0.8);
    text-align: center;
    vertical-align: middle;
    .modal {
      background: white;
      padding: 50px;
      display: grid;
      grid-template-columns: 1fr 2fr;
      grid-gap: 20px;
      width: 70%;
      margin: auto;
      border-radius: 3px;
      font-weight: 300;
      position: relative;
      > div {
        padding: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        position: relative;
        box-sizing: border-box;
      }
      .book-details {
        font-size: 14px;
        line-height: 1.5;
        text-align: left;
        position: relative;
        .relevant-info {
          .book-title {
            font-size: 20px;
            font-weight: 900;
          }
          .book-authors {
            margin-bottom: 4px;
          }
          .rating-container {
            margin-top: 5px;
            // font-size: 15px;
            background-color: #2c3e50;
            width: fit-content;
            border-radius: 3px;
            margin-right: 5px;
            .rating-star {
              display: inline-block;
              padding-right: 4px;
              color: gold; /* Color for filled stars */
              &::before {
                content: "★";
              }
            }
            .average-rating {
              color: #fff;
              // font-size: 13px;
              padding-top: 4px;
              padding-left: 4px;
              margin-right: 2px;
            }
          }
          .book-price {
            font-weight: 900;
            font-size: 20px;
          }
          .use-book {
            display: flex;
            .buy-link,
            .download-link {
              display: flex;
              align-items: center;
              padding: 5px;
              width: fit-content;
              color: #fff;
              background-color: #2c3e50;
              border-radius: 3px;
              width: fit-content;
              margin-right: 15px;
              margin-top: 5px;
              &:hover {
                cursor: pointer;
              }
            }
          }
        }
      }
      .additional-info {
        text-align: left;
        font-size: 14px;
        max-height: 200px;
        .title {
          margin-bottom: 5px;
          font-size: 16px;
          font-weight: 600;
        }
        &.specs {
          .title {
            margin-left: 3px;
          }
          table {
            width: 100%;
            tr td:last-child {
              text-align: right;
            }
          }
        }
        &.description {
          overflow-y: auto;
        }
      }
    }
  }
}

.content {
  min-height: 100%;
  height: 100%;
  background: white;
  position: relative;
  z-index: 0;
  h1 {
    padding: 75px 0 30px 0;
    text-align: center;
    font-size: 30px;
    line-height: 30px;
  }
  .buttons {
    max-width: 800px;
    margin: 0 auto;
    padding: 0;
    text-align: center;
    .button {
      display: inline-block;
      text-align: center;
      padding: 10px 15px;
      margin: 10px;
      background: red;
      font-size: 18px;
      background-color: #efefef;
      border-radius: 3px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      &:hover {
        color: white;
        background: #009bd5;
      }
    }
  }
}

@media (max-width: 660px) {
  /* CSS styles for small screens */

  #modal-container .modal-background .modal {
    grid-template-columns: 1fr;
    overflow-y: auto;
    padding: 20px;
    width: 90%;
    max-height: 500px;
  }
}

@keyframes unfoldIn {
  0% {
    transform: scaleY(0.005) scaleX(0);
  }
  50% {
    transform: scaleY(0.005) scaleX(1);
  }
  100% {
    transform: scaleY(1) scaleX(1);
  }
}

@keyframes unfoldOut {
  0% {
    transform: scaleY(1) scaleX(1);
  }
  50% {
    transform: scaleY(0.005) scaleX(1);
  }
  100% {
    transform: scaleY(0.005) scaleX(0);
  }
}

@keyframes zoomIn {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes zoomOut {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}

@keyframes fadeIn {
  0% {
    background: rgba(0, 0, 0, 0);
  }
  100% {
    background: rgba(0, 0, 0, 0.7);
  }
}

@keyframes fadeOut {
  0% {
    background: rgba(0, 0, 0, 0.7);
  }
  100% {
    background: rgba(0, 0, 0, 0);
  }
}

@keyframes scaleUp {
  0% {
    transform: scale(0.8) translateY(1000px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0px);
    opacity: 1;
  }
}

@keyframes scaleDown {
  0% {
    transform: scale(1) translateY(0px);
    opacity: 1;
  }
  100% {
    transform: scale(0.8) translateY(1000px);
    opacity: 0;
  }
}

@keyframes scaleBack {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.85);
  }
}

@keyframes scaleForward {
  0% {
    transform: scale(0.85);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes quickScaleDown {
  0% {
    transform: scale(1);
  }
  99.9% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}

@keyframes slideUpLarge {
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-100%);
  }
}

@keyframes slideDownLarge {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0%);
  }
}

@keyframes moveUp {
  0% {
    transform: translateY(150px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes moveDown {
  0% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(150px);
  }
}

@keyframes blowUpContent {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  99.9% {
    transform: scale(2);
    opacity: 0;
  }
  100% {
    transform: scale(0);
  }
}

@keyframes blowUpContentTwo {
  0% {
    transform: scale(2);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes blowUpModal {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes blowUpModalTwo {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

@keyframes roadRunnerIn {
  0% {
    transform: translateX(-1500px) skewX(30deg) scaleX(1.3);
  }
  70% {
    transform: translateX(30px) skewX(0deg) scaleX(0.9);
  }
  100% {
    transform: translateX(0px) skewX(0deg) scaleX(1);
  }
}

@keyframes roadRunnerOut {
  0% {
    transform: translateX(0px) skewX(0deg) scaleX(1);
  }
  30% {
    transform: translateX(-30px) skewX(-5deg) scaleX(0.9);
  }
  100% {
    transform: translateX(1500px) skewX(30deg) scaleX(1.3);
  }
}
</style>
