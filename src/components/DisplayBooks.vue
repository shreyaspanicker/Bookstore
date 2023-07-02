<template>
  <section>
    <display-message
      :queryDisplay="queryDisplay"
      :isLoaded="books.length"
      :message="message"
    ></display-message>
    <div class="books-container">
      <resize-observer @notify="handleResize" />
      <div
        class="book-container"
        v-for="book in paginatedItems"
        :key="`${book.id}_${book.etag}`"
        @click="$emit('bookClicked', book.id, paginatedItems)"
      >
        <div class="book-image">
          <img
            :src="
              book.volumeInfo.imageLinks
                ? book.volumeInfo.imageLinks.thumbnail
                : 'images/no-preview.png'
            "
            style="width: 150px; height: 200px"
            alt=""
          />
        </div>
        <div class="book-details">
          <div class="book-title">{{ book.volumeInfo.title }}</div>
          <div
            class="book-authors"
            v-if="
              book.volumeInfo.authors && book.volumeInfo.authors.length !== 0
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
          <div
            class="rating-container"
            :id="`r-${book.id}`"
            v-if="book.volumeInfo.averageRating"
          >
            <span class="rating-star"></span>
            <span class="rating-star"></span>
            <span class="rating-star"></span>
            <span class="rating-star"></span>
            <span class="rating-star"></span>
            <span class="rating-count"
              >({{ book.volumeInfo.ratingsCount }})</span
            >
          </div>
        </div>
      </div>
      <div class="pagination" v-if="this.books.length">
        <button
          @click="
            {
              currentPage = 1;
              scrollToTop();
            }
          "
          :disabled="this.currentPage === 1"
        >
          <uil-angle-double-left />
        </button>
        <button @click="previousPage" :disabled="this.currentPage === 1">
          <uil-angle-left />
        </button>
        <button
          class=""
          @click="pageClick"
          v-for="page in paginationRange"
          :key="page"
          :class="page == currentPage ? 'active' : ''"
        >
          {{ page }}
        </button>
        <button @click="nextPage" :disabled="currentPage === totalPages">
          <uil-angle-right />
        </button>
        <button
          @click="
            {
              currentPage = totalPages;
              scrollToTop();
            }
          "
          :disabled="currentPage === totalPages"
        >
          <uil-angle-double-right />
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import {
  UilAngleLeft,
  UilAngleRight,
  UilAngleDoubleLeft,
  UilAngleDoubleRight,
} from "@iconscout/vue-unicons";
import DisplayMessage from "./DisplayMessage.vue";
import "vue-resize/dist/vue-resize.css";
import data from "../utils/data.json";

export default {
  name: "DisplayBooks",
  data() {
    return {
      books: [],
      totalResults: 240,
      currentPage: 1,
      perPage: 16,
      queryParams: {
        q: "*",
        maxResults: 40,
        orderBy: "relevance",
      },
      queryDisplay: "",
      message: "",
    };
  },
  components: {
    UilAngleLeft,
    UilAngleDoubleLeft,
    UilAngleRight,
    UilAngleDoubleRight,
    DisplayMessage,
  },
  props: {
    searchParams: Object,
  },
  beforeMount() {
    this.fetchBooks(0);
  },
  computed: {
    paginatedItems() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.books.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.books.length / this.perPage);
    },
    paginationRange() {
      const range = 2; // Number of buttons to show before and after the current page
      const start = Math.max(1, this.currentPage - range);
      const end = Math.min(this.totalPages, this.currentPage + range);
      return Array.from(
        { length: end - start + 1 },
        (_, index) => start + index
      );
    },
  },
  watch: {
    searchParams({ category, keywords }) {
      if (keywords.length) {
        let queryParams = {
          ...this.queryParams,
          q:
            category !== "Language"
              ? keywords.join(" ")
              : this.getSelectedLanguages(keywords).join(" "),
          [data.categories.find((each) => each.value === category).id]:
            keywords.join(" "),
        };
        this.constructQueryDisplay(keywords, category);
        this.fetchBooks(0, queryParams);
      } else {
        this.queryDisplay = "";
        this.fetchBooks(0);
      }
      this.message = "";
      this.books = [];
      this.currentPage = 1;
    },
    currentPage() {
      this.$nextTick(() => this.putRatingOnBooks());
    },
  },
  methods: {
    constructQueryDisplay(keywords, category) {
      let queryString;
      if (category === "Language") {
        queryString = this.getSelectedLanguages(keywords).join(", ");
      } else {
        queryString = keywords.join(", ");
      }
      const replacementIndex = queryString.lastIndexOf(", ");
      if (replacementIndex !== -1) {
        const prefix = queryString.substring(0, replacementIndex);
        const suffix = queryString.substring(replacementIndex + 1);
        this.queryDisplay = ` with "${prefix} & ${suffix}" keywords in "${category.toLowerCase()}"`;
      } else {
        this.queryDisplay = queryString.length
          ? ` with "${queryString}" keyword in "${category.toLowerCase()}"`
          : "";
      }
    },
    getSelectedLanguages(keywords) {
      return keywords.map((each) =>
        data.languages.find((lang) => lang.code === each).text.toLowerCase()
      );
    },
    fetchBooks(startIndex, queryParams = this.queryParams) {
      axios
        .get(`https://www.googleapis.com/books/v1/volumes?`, {
          params: { ...queryParams, startIndex: startIndex },
        })
        .then((response) => {
          if (response.data.items !== undefined) {
            this.books.push(...response.data.items);
            if (startIndex + this.queryParams.maxResults < this.totalResults) {
              startIndex += this.queryParams.maxResults;
              this.fetchBooks(startIndex, queryParams);
            }
          } else {
            throw new Error("No data");
          }
        })
        .then(this.putRatingOnBooks)
        .catch((error) => {
          if (error.message === "No data") {
            this.message = `Sorry, no books are available with th${
              this.searchParams.keywords.length > 1
                ? "ese keywords"
                : "is keyword"
            } in the selected category. Try again... ⏭️`;
          } else if (error.message === "Network Error") {
            this.message = "Please check your internet connectivity... 😒";
          } else if (error.response.status === 400) {
            this.message =
              "Internal Server Error. Please try after some time or use different search keywords...😊";
          } else {
            console.error(error);
          }
        });
    },
    putRatingOnBooks() {
      this.paginatedItems.forEach((each) => {
        const ratingValue = each.volumeInfo.averageRating;
        const ratingContainer = document.getElementById(`r-${each.id}`);
        if (ratingContainer) {
          const ratingStars = ratingContainer.querySelectorAll(`.rating-star`);
          // Calculate the number of stars to be filled
          const filledStars = Math.round(ratingValue * 2) / 2;

          // Add the 'filled' class to the appropriate number of stars
          ratingStars.forEach((star, index) => {
            if (index < filledStars) {
              star.classList.add("filled");
            }
          });
        }
        each.volumeInfo.title = this.capitalizeWords(each.volumeInfo.title);
      });
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.scrollToTop();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.scrollToTop();
      }
    },
    pageClick(e) {
      this.currentPage = parseInt(e.target.textContent);
      this.scrollToTop();
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    capitalizeWords(str) {
      return str.replace(/\b\w/g, function (match) {
        return match.toUpperCase();
      });
    },
    randomSort(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    },
    handleResize({ width }) {
      if (width < 1340) this.perPage = 18;
      else this.perPage = 16;
    },
  },
};
</script>

<style scoped lang="scss">
.books-container {
  padding: 10px 60px 0px;
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 15px;
  .book-container {
    max-height: 275px;
    overflow: hidden;
    display: flex;
    padding: 20px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }
    .book-details {
      padding: 10px;
      font-size: 16px;
      line-height: 1.5;
      .book-title {
        font-weight: 900;
      }
      .book-authors {
        font-size: 12px;
      }
      .rating-container {
        font-size: 20px;
        display: flex;
        .rating-star {
          display: inline-block;
          &.filled {
            color: gold; /* Color for filled stars */
          }
          &::before {
            content: "★";
          }
        }
        .rating-count {
          font-size: 13px;
          padding-top: 6px;
        }
      }
    }
  }
  .pagination {
    padding: 20px;
    grid-column: 1 / span 4; /* Span the item across all three columns */
    text-align: center; /* Center the item horizontally */
    position: relative;
    button {
      font-family: "Fira Sans", sans-serif;
      margin: 4px;
      font-size: 18px;
      width: 30px;
      border: none;
      background-color: #fff;
      &.active {
        background-color: #2c3e50;
        color: #fff;
        &:hover {
          background-color: #43586c;
        }
      }
      svg {
        height: 14px;
      }
      &:hover {
        cursor: pointer;
        background-color: #2c3e50;
        color: #fff;
      }
    }
  }
}

@media (max-width: 1340px) {
  .books-container {
    grid-template-columns: 1fr 1fr 1fr;
    .pagination {
      grid-column: 1 / span 3;
    }
  }
}
@media (max-width: 995px) {
  .books-container {
    grid-template-columns: 1fr 1fr;

    .pagination {
      grid-column: 1 / span 2;
    }
  }
}

@media (max-width: 767px) {
  .books-container {
    padding: 10px 20px 0px;
    .pagination {
      grid-column: 1 / span 2;
    }
  }
}
@media (max-width: 660px) {
  .books-container {
    padding: 20px;
    grid-template-columns: 1fr;
    .pagination {
      grid-column: 1 / span 1;
      padding: 20px 0px;
      button {
        margin: 4px 0px;
      }
    }
  }
}
</style>
