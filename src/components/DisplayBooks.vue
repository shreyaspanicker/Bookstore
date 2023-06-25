<template>
  <div class="books-container">
    <div
      class="book-container"
      v-for="book in books"
      :key="`${book.id}_${book.etag}`"
    >
      <div class="book-image">
        <img :src="book.volumeInfo.imageLinks.thumbnail" alt="" />
      </div>
      <div class="book-details">
        <div class="book-title">{{ book.volumeInfo.title }}</div>
        <div class="book-authors">
          Written by:
          <span
            v-for="(author, index) in book.volumeInfo.authors"
            :key="`${index}_${book.volumeInfo.contentVersion}`"
          >
            {{ author }}
            <span v-show="index + 1 !== book.volumeInfo.authors.length">,</span>
          </span>
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
      maxResults: 30,
      API_KEY: "AIzaSyDr75FYl5W5rPQxmnL7Mm1cYyivVDU46PA",
    };
  },
  beforeMount() {
    this.searchQuery = "*";
    this.fetchBooks();
  },
  computed: {
    encodedSearchQuery() {
      return encodeURIComponent(this.searchQuery);
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
        })
        .catch((error) => {
          console.log(error);
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
  .book-container {
    display: flex;
    align-items: center;
  }
}

@media (max-width: 767px) {
  /* CSS styles for small screens */

  .books-container {
    padding: 30px;
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 467px) {
  /* CSS styles for small screens */

  .books-container {
    padding: 30px;
    grid-template-columns: 1fr;
  }
}
</style>
