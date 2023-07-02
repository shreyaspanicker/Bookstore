<template>
  <div class="search-box">
    <div class="drop-down">
      <div @click="toggleDropdownButton">
        <input
          disabled
          placeholder="Choose a search category"
          v-model="selectedType"
        />
        <span class="toggle-button">
          <uil-angle-down
            v-if="isClosed"
            size="30px"
            class="logo"
          ></uil-angle-down>
          <uil-times v-else size="30px" class="logo"></uil-times>
        </span>
      </div>
      <section
        id="dropdown-menu"
        class="dropdown-menu"
        :class="!isClosed ? 'open' : ''"
      >
        <button
          @click="handleMenuLabelButtonClicked(type)"
          v-for="type in filteredTypes"
          :key="type.id"
        >
          {{ type.value }}
        </button>
      </section>
    </div>
    <div class="tags-input">
      <vue-tags-input
        v-model="tag"
        :placeholder="getPlaceHolder"
        :avoid-adding-duplicates="true"
        :autocomplete-items="
          this.selectedType === 'Language' ? filteredItems : []
        "
        :max-tags="5"
        :add-only-from-autocomplete="
          this.selectedType === 'Language' ? true : false
        "
        :separators="[',']"
        :tags="tags"
        @tags-changed="updateTags"
      />
      <span class="logo"><uil-search-alt size="30px" /></span>
    </div>
  </div>
</template>

<script>
import { UilSearchAlt, UilAngleDown, UilTimes } from "@iconscout/vue-unicons";
import VueTagsInput from "@johmun/vue-tags-input";
import data from "../utils/data.json";

export default {
  name: "SearchBox",
  data() {
    return {
      tag: "",
      tags: [],
      types: data.categories,
      selectedType: data.categories[0].value,
      languages: data.languages,
      isClosed: true,
    };
  },
  components: {
    UilSearchAlt,
    VueTagsInput,
    UilAngleDown,
    UilTimes,
  },
  props: {
    closeDropDown: Boolean,
  },
  watch: {
    tags(value) {
      if (value.length && this.selectedType) {
        this.emitEvent(this.selectedType, value);
      } else if (this.selectedType) {
        this.emitEvent(this.selectedType, value);
      }
    },
    selectedType(value) {
      if (this.tags.length) {
        this.tags = [];
        this.emitEvent(value, this.tags);
      }
    },
    closeDropDown(value) {
      if (value) this.toggleDropdownButton();
    },
  },
  computed: {
    getPlaceHolder() {
      return !this.tags.length
        ? this.types.find((each) => each.value === this.selectedType)
            .placeHolder
        : "";
    },
    filteredTypes() {
      return this.types.filter((each) => each.value !== this.selectedType);
    },
    filteredItems() {
      return this.languages.filter((i) => {
        return i.text.toLowerCase().indexOf(this.tag.toLowerCase()) !== -1;
      });
    },
  },
  methods: {
    updateTags(newTags) {
      this.tags = newTags;
    },
    toggleDropdownButton(event) {
      this.isClosed = !this.isClosed;
      this.$emit("isDropDownClosed", this.isClosed);
      if (event) event.stopPropagation();
    },
    handleMenuLabelButtonClicked(type) {
      this.selectedType = type.value;
      this.toggleDropdownButton();
    },
    emitEvent(category, keywords) {
      const params = this.updateStore(category, keywords);
      this.$emit("searched", params);
    },
    updateStore(category, keywords) {
      const params = {
        category: category,
        keywords:
          category === "Language"
            ? keywords.length
              ? keywords.map((each) => each.code)
              : []
            : keywords.length
            ? keywords.map((each) => each.text)
            : [],
      };
      this.$store.commit("setSearchParams", params);
      return params;
    },
  },
};
</script>

<style lang="scss">
.search-box {
  margin-top: 30px;
  > div {
    display: inline-block;
    position: relative;
    height: 25px;
    margin-right: 20px;
    margin-bottom: 5px;
    input {
      color: #000;
    }
    .logo {
      position: absolute;
      top: 0;
      right: 0;
      &:hover {
        color: #43586c;
      }
    }
  }

  .tags-input {
    .vue-tags-input {
      min-width: 280px;
      .ti-input {
        padding: 5px 10px 0px 0px;
        border: none;
        border-bottom: 1px solid #2c3e50;
        .ti-new-tag-input-wrapper {
          padding: 0px;
          margin-bottom: 4px;
          .ti-new-tag-input {
            color: #000;
            font-size: 16px;
            outline: none;
            font-family: "Fira Sans", sans-serif;
          }
        }
        .ti-tag {
          background-color: #2c3e50;
        }
      }

      .ti-autocomplete {
        background-color: #fff;
        color: #2c3e50;
        border: none;
        max-height: 300px;
        overflow: auto;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        font-size: 14px;
        .ti-selected-item {
          background-color: #2c3e50;
          color: white;
        }
        .ti-item > div {
          padding: 5px;
        }
      }
    }
    .logo {
      cursor: pointer;
    }
  }
  .drop-down {
    margin-bottom: 20px;
    input {
      width: 280px;
      background-color: #fff;
      padding: 5px 10px 0px 0px;
      border: none;
      border-bottom: 1px solid #2c3e50;
      font-family: "Fira Sans", sans-serif;
      font-size: 16px;
      padding-bottom: 4px;
      &:hover {
        cursor: pointer;
      }
    }
    .toggle-button {
      display: flex;
      align-items: center;
      border: 0;
      cursor: pointer;
      font-size: 16px;
      padding: 0px;
      .logo {
        color: #2c3e50;
        padding: 0px;
        &:hover {
          color: #43586c;
        }
      }
    }
    .dropdown-menu {
      position: absolute;
      left: 0;
      top: 29px;
      z-index: 1;
      width: 280px;
      translate: -30px 0;
      opacity: 0;
      visibility: hidden;
      border-radius: 3px;
      background-color: #fff;
      transition: 0.4s;
      &.open {
        translate: 0 0;
        opacity: 1;
        visibility: visible;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
      }
      button {
        font-family: "Fira Sans", sans-serif;
        border: 0;
        border-radius: 0;
        width: 100%;
        height: 30px;
        color: #2c3e50;
        padding: 5px;

        text-align: left;
        background-color: #fff;
        &:hover {
          color: #fff;
          background: #2c3e50;
        }
      }
    }
  }
}
</style>
