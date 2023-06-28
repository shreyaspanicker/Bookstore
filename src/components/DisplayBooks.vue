<template>
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
          v-if="book.volumeInfo.authors && book.volumeInfo.authors.length !== 0"
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
          <span class="rating-count">({{ book.volumeInfo.ratingsCount }})</span>
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
</template>

<script>
import axios from "axios";
import {
  UilAngleLeft,
  UilAngleRight,
  UilAngleDoubleLeft,
  UilAngleDoubleRight,
} from "@iconscout/vue-unicons";

import "vue-resize/dist/vue-resize.css";

export default {
  name: "DisplayBooks",
  data() {
    return {
      books: [],
      totalResults: 240,
      maxResults: 40,
      currentPage: 1,
      perPage: 16,
      searchQuery: "*",
      API_KEY: "AIzaSyCjaKpdcjdAG_yZBm5vKvZzYoJZ41RE-vY",
    };
  },
  components: {
    UilAngleLeft,
    UilAngleDoubleLeft,
    UilAngleRight,
    UilAngleDoubleRight,
  },
  props: {
    isCleared: Boolean,
    searchedQuery: String,
  },
  beforeMount() {
    this.fetchBooks(0);
  },
  computed: {
    encodedSearchQuery() {
      return encodeURIComponent(this.searchQuery);
    },
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
    isCleared() {
      this.books = [];
      this.searchQuery = "*";
      this.fetchBooks(0);
    },
    searchedQuery(value) {
      if (value !== "") {
        this.books = [];
        this.searchQuery = value;
        this.fetchBooks(0);
      }
    },
    currentPage() {
      this.$nextTick(() => this.putRatingOnBooks());
    },
  },
  methods: {
    fetchBooks(startIndex) {
      const apiURL = `https://www.googleapis.com/books/v1/volumes?q=${this.encodedSearchQuery}&key=${this.API_KEY}&startIndex=${startIndex}&maxResults=${this.maxResults}`;
      axios
        .get(apiURL)
        .then((response) => {
          this.books.push(...this.randomSort(response.data.items));
          if (startIndex + this.maxResults < this.totalResults) {
            startIndex += this.maxResults;
            this.fetchBooks(startIndex);
          }
        })
        .then(() => {
          this.putRatingOnBooks();
        })
        .catch((error) => {
          console.log(error);
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
  padding: 0px 60px;
  display: grid;
  justify-content: center;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 15px;
  .book-container {
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
  /* CSS styles for small screens */

  .books-container {
    // padding: 30px;
    grid-template-columns: 1fr 1fr 1fr;
    .pagination {
      grid-column: 1 / span 3;
    }
  }
}
@media (max-width: 995px) {
  /* CSS styles for small screens */

  .books-container {
    // padding: 30px;
    grid-template-columns: 1fr 1fr;

    .pagination {
      grid-column: 1 / span 2;
    }
  }
}
@media (max-width: 660px) {
  /* CSS styles for small screens */

  .books-container {
    padding: 30px;
    grid-template-columns: 1fr;
    .pagination {
      grid-column: 1 / span 1;
    }
  }
}
</style>
