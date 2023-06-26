<template>
  <div class="books-container">
    <div
      class="book-container"
      v-for="book in books"
      :key="`${book.id}_${book.etag}`"
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
        <div class="book-authors">
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
        <div class="rating-container" :id="`r-${book.id}`">
          <span class="rating-star"></span>
          <span class="rating-star"></span>
          <span class="rating-star"></span>
          <span class="rating-star"></span>
          <span class="rating-star"></span>
          <span class="rating-count">({{ book.volumeInfo.ratingsCount }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DisplayBooks",
  data() {
    return {
      books: [],
      maxResults: 40,
      searchQuery: "*",
      API_KEY: "AIzaSyDr75FYl5W5rPQxmnL7Mm1cYyivVDU46PA",
    };
  },
  props: {
    isCleared: Boolean,
    searchedQuery: String,
  },
  beforeMount() {
    this.fetchBooks();
  },
  computed: {
    encodedSearchQuery() {
      return encodeURIComponent(this.searchQuery);
    },
  },
  watch: {
    isCleared() {
      this.books = [];
      this.searchQuery = "*";
      this.fetchBooks();
    },
    searchedQuery(value) {
      if (value !== "") {
        this.books = [];
        this.searchQuery = value;
        this.fetchBooks();
      }
    },
  },
  methods: {
    fetchBooks() {
      const apiURL = `https://www.googleapis.com/books/v1/volumes?q=${this.encodedSearchQuery}&key=${this.API_KEY}&maxResults=${this.maxResults}`;
      axios
        .get(apiURL)
        .then((response) => {
          this.totalNoOfItems = response.data.totalItems;
          this.books = [...response.data.items];
          this.books = this.books.filter((book) => {
            return (
              book?.volumeInfo?.authors !== undefined &&
              book?.volumeInfo?.averageRating !== undefined
            );
          });
        })
        .then(this.putRatingOnBooks)
        .catch((error) => {
          console.log(error);
        });
    },
    putRatingOnBooks() {
      this.books.forEach((each) => {
        const ratingValue = each.volumeInfo.averageRating;
        const ratingContainer = document.getElementById(`r-${each.id}`);
        const ratingStars = ratingContainer.querySelectorAll(`.rating-star`);

        // Calculate the number of stars to be filled
        const filledStars = Math.round(ratingValue * 2) / 2;

        // Add the 'filled' class to the appropriate number of stars
        ratingStars.forEach((star, index) => {
          if (index < filledStars) {
            star.classList.add("filled");
          }
        });
      });
    },
  },
};
</script>

<style scoped lang="scss">
.books-container {
  padding: 60px;
  padding-top: 0px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 15px;
  .book-container {
    display: flex;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
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
}

@media (max-width: 760px) {
  /* CSS styles for small screens */

  .books-container {
    padding: 30px;
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 460px) {
  /* CSS styles for small screens */

  .books-container {
    padding: 30px;
    grid-template-columns: 1fr;
  }
}
</style>
