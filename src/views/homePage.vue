<template>
  <v-container class="main-container" :class="{ blurred: isBlurred }">
    <progress-loader v-if="isLoading"></progress-loader>
    <v-fade-transition v-if="$vuetify.display.mdAndUp">
      <div
        v-if="isBlurred && $vuetify.display.mdAndUp"
        class="overlay"
        @click.self="isBlurred = false"
      >
        <div v-if="isBlurred" class="download-popup">
          <p style="color: red" v-if="displayError">
            En az bir dosya seçmelisiniz.
          </p>
          <v-checkbox-group
            v-if="files.length > 0"
            class="custom-radio-group"
            multiple
            transition="false"
          >
            <v-checkbox
              class="custom-radio"
              label="Hepsini Seç"
              :model-value="isAllSelected"
              @change="toggleSelectAll"
            ></v-checkbox>

            <v-checkbox
              class="custom-radio"
              v-for="(item, index) in files"
              :key="index"
              :label="item.name"
              v-model="selectedFiles"
              :value="item.webContentLink"
            ></v-checkbox>
          </v-checkbox-group>
          <div class="download-buttons-container">
            <v-btn
              @click="downloadFilesAsZip"
              class="zip-download-btn text-none"
              block
            >
              ZIP İndir
              <v-img
                width="24"
                height="24"
                :src="require('@/assets/zip-icon.svg')"
              ></v-img>
            </v-btn>
            <v-btn
              @click="downloadSelectedFiles"
              class="seperate-download-btn text-none"
              block
            >
              Seçilenleri İndir
            </v-btn>
          </div>
        </div>
      </div>
    </v-fade-transition>

    <v-img
      v-if="$vuetify.display.mdAndUp"
      width="311"
      height="223"
      class="bg-item bg-item1"
      :src="require('@/assets/bg-item1.svg')"
    />
    <v-img
      v-if="$vuetify.display.mdAndUp"
      width="273"
      height="363"
      class="bg-item bg-item2"
      :src="require('@/assets/bg-item2.svg')"
      alt=""
    />
    <v-container class="box-container">
      <div v-if="$vuetify.display.smAndDown" class="top-bar-mobile">
        <v-img
          class="logo"
          max-width="156"
          max-height="49"
          :src="require('@/assets/DOGANLED-LOGO.svg')"
          alt="DOĞAN LED AYDINLATMA"
          contain
        />

        <h4>DOKÜMAN SİSTEMİ</h4>
      </div>
      <v-container class="box font-inter">
        <div v-if="$vuetify.display.mdAndUp" class="top-bar">
          <v-img
            class="logo"
            max-width="260"
            max-height="78"
            :src="require('@/assets/DOGANLED-LOGO.svg')"
            alt="DOĞAN LED AYDINLATMA"
            contain
          />
          <div class="d-flex align-center">
            <h2>DOĞAN LED AYDINLATMA</h2>
            <hr />
            <h4>DOKÜMAN SİSTEMİ</h4>
          </div>

          <social-icons />
        </div>
        <div v-if="$vuetify.display.mdAndUp" class="content-container">
          <div class="content-left-container">
            <div class="selects-container">
              <v-autocomplete
                v-model="selectedCategory"
                @update:model-value="fetchNextLevel(selectedCategory, 0)"
                label="KATEGORİ SEÇİNİZ"
                bg-color="rgba(0, 0, 0, 0.4)"
                append-inner-icon="mdi-chevron-down"
                class="custom-select font-poppins"
                menu-icon=""
                :items="categories"
                item-value="id"
                item-title="name"
                hide-details="true"
                spellcheck="false"
              ></v-autocomplete>

              <component
                v-for="(step, index) in selectionSteps"
                :key="index"
                v-model="selectedValues[index]"
                :is="index < 2 ? 'v-autocomplete' : 'v-select'"
                @update:model-value="
                  fetchNextLevel(selectedValues[index], index + 1)
                "
                bg-color="rgba(0, 0, 0, 0.4)"
                label="SEÇİNİZ"
                append-inner-icon="mdi-chevron-down"
                class="custom-select font-poppins"
                menu-icon=""
                :items="step.options"
                item-value="id"
                item-title="name"
                hide-details="true"
                spellcheck="false"
              ></component>
            </div>
            <v-btn
              @click="isBlurred = true"
              class="show-files-button text-none"
              v-if="!isBlurred && files.length > 0"
            >
              Dosyaları Getir
            </v-btn>
          </div>
        </div>
        <div v-else class="content-container-mobile">
          <div class="selects-container">
            <v-autocomplete
              v-model="selectedCategory"
              @update:model-value="fetchNextLevel(selectedCategory, 0)"
              label="KATEGORİ SEÇİNİZ"
              bg-color="rgba(0, 0, 0, 0.4)"
              append-inner-icon="mdi-chevron-down"
              class="custom-select font-poppins"
              menu-icon=""
              :items="categories"
              item-value="id"
              item-title="name"
              hide-details="true"
              spellcheck="false"
            ></v-autocomplete>

            <component
              v-for="(step, index) in selectionSteps"
              :key="index"
              v-model="selectedValues[index]"
              :is="index < 2 ? 'v-autocomplete' : 'v-select'"
              @update:model-value="
                fetchNextLevel(selectedValues[index], index + 1)
              "
              bg-color="rgba(0, 0, 0, 0.4)"
              label="SEÇİNİZ"
              append-inner-icon="mdi-chevron-down"
              class="custom-select font-poppins"
              menu-icon=""
              :items="step.options"
              item-value="id"
              item-title="name"
              hide-details="true"
            ></component>
          </div>

          <div class="download-mobile-container">
            <v-checkbox-group
              class="custom-radio-group"
              multiple
              transition="false"
              v-if="files.length > 0"
            >
              <p style="color: red; margin: 0 auto" v-if="displayError">
                En az bir dosya seçmelisiniz.
              </p>
              <v-checkbox
                class="custom-radio"
                label="Hepsini Seç"
                :model-value="isAllSelected"
                @change="toggleSelectAll"
                hide-details="true"
              ></v-checkbox>

              <v-checkbox
                class="custom-radio"
                v-for="(item, index) in files"
                :key="index"
                :label="item.name"
                v-model="selectedFiles"
                :value="item.webContentLink"
                hide-details="true"
              ></v-checkbox>
            </v-checkbox-group>
            <div class="download-buttons-container">
              <v-btn
                :disabled="!files.length"
                @click="downloadFilesAsZip"
                class="zip-download-btn text-none"
                block
              >
                ZIP İndir
                <v-img
                  width="18"
                  height="18"
                  :src="require('@/assets/zip-icon.svg')"
                ></v-img>
              </v-btn>
              <v-btn
                :disabled="!files.length"
                @click="downloadSelectedFiles"
                class="seperate-download-btn text-none"
                block
              >
                Seçilenleri İndir
              </v-btn>
            </div>
          </div>
        </div>
      </v-container>
      <v-footer v-if="$vuetify.display.mdAndUp" class="footer">
        <div class="footer-text font-poppins">
          <span>Kolaylık Elektrik San. Tic. A.Ş. © 2025</span>
          <a href="">www.doganled.com.tr</a>
        </div>
        <v-img
          class="circle-logo"
          width="208"
          height="208"
          :src="require('@/assets/KOLAYLIK-LOGO.png')"
          cover
        />
      </v-footer>
      <v-footer v-else class="footer-mobile font-poppins">
        <a href="">
          <v-img
            class="circle-logo-mobile"
            width="75"
            height="75"
            :src="require('@/assets/KOLAYLIK-LOGO.png')"
            cover
          />
        </a>
        <div class="footer-mobile-center">
          <a href="www.doganled.com.tr">www.doganled.com.tr</a>
          <social-icons />
          <span>Kolaylık Elektrik San. Tic. A.Ş. © 2025</span>
        </div>
        <div class="footer-mobile-right">
          <h5>DOĞAN LED AYDINLATMA</h5>
          <h6>DÖKÜMAN SİSTEMİ</h6>
        </div>
      </v-footer>
    </v-container>
  </v-container>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import ProgressLoader from "@/components/ProgressLoader.vue";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios";
import SocialIcons from "@/components/SocialIcons.vue";
const categories = ref([]);
const selectionSteps = ref([]);
const selectedCategory = ref("");
const selectedValues = ref([]);
const files = ref([]);
const selectedFiles = ref([]);
const selectAll = ref(false);
const apiKey = "AIzaSyDNn-oguslOMXTW1TjLoQfdKvcmlZbhiCg";
const rootFolderId = "1VJuskPhsTCp3dw8ACANrwLVqYpizbcqK";
const isBlurred = ref(false);
const displayError = ref(false);
const isLoading = ref(false);

const fetchFolders = async (parentId) => {
  try {
    const url = `https://www.googleapis.com/drive/v3/files?q='${parentId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&fields=files(id,name)&key=${apiKey}`;
    const response = await axios.get(url);
    return response.data.files || [];
  } catch (error) {
    console.error("Error fetching folders:", error);
    return [];
  }
};

const fetchFiles = async (parentId) => {
  try {
    // Search by both MIME types and file extensions
    const mimeTypeQuery = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/zip",
      "application/vnd.google-apps.shortcut",
    ].join("' or mimeType='");

    // Add file extension search
    const extensionQuery = [
      "name contains '.ies'",
      "name contains '.ldt'",
    ].join(" or ");

    const url = `https://www.googleapis.com/drive/v3/files?q='${parentId}'+in+parents+and+((mimeType='${mimeTypeQuery}') or (${extensionQuery}))&fields=files(id,name,mimeType,shortcutDetails)&key=${apiKey}`;

    const response = await axios.get(url);

    files.value = response.data.files.map((file) => ({
      id: file.shortcutDetails ? file.shortcutDetails.targetId : file.id,
      name: file.name,
      webContentLink: `https://drive.google.com/uc?export=download&id=${
        file.shortcutDetails ? file.shortcutDetails.targetId : file.id
      }`,
    }));
    if (files.value.length > 0) {
      isBlurred.value = true;
      selectAll.value = false;
      selectedFiles.value = [];
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    files.value = [];
  }
};
const formattedDate = (date) =>
  date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

const fetchCategories = async () => {
  categories.value = await fetchFolders(rootFolderId);
};

const fetchNextLevel = async (parentId, level) => {
  if (!parentId) return;

  const folders = await fetchFolders(parentId);

  if (folders.length > 0) {
    selectionSteps.value = selectionSteps.value.slice(0, level);
    selectionSteps.value.push({
      label: `Option ${level + 1}`,
      options: folders,
    });
    selectedValues.value = selectedValues.value.slice(0, level);
    files.value = [];
  } else {
    selectionSteps.value = selectionSteps.value.slice(0, level);
    selectedValues.value = selectedValues.value.slice(0, level);
    await fetchFiles(parentId);
  }
};
const isAllSelected = computed(() => {
  return (
    files.value.length > 0 && selectedFiles.value.length === files.value.length
  );
});

function toggleSelectAll() {
  if (!isAllSelected.value) {
    selectedFiles.value = files.value.map((file) => file.webContentLink);
  } else {
    selectedFiles.value = [];
  }
}
const downloadFilesAsZip = async () => {
  isLoading.value = true;
  if (!Array.isArray(selectedFiles.value) || selectedFiles.value.length === 0) {
    displayError.value = true;
    console.error("No files selected");
    return;
  }

  const zip = new JSZip();
  const filePromises = selectedFiles.value.map(async (fileUrl) => {
    try {
      const fileObj = files.value.find((f) => f.webContentLink === fileUrl);
      if (!fileObj) return;

      const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileObj.id}?alt=media&key=${apiKey}
`;
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      zip.file(fileObj.name || `${fileObj.id}.pdf`, blob);
    } catch (error) {
      console.error(`Error downloading file ${fileUrl}:`, error);
    }
  });

  await Promise.all(filePromises);

  // Generate ZIP and trigger download
  zip.generateAsync({ type: "blob" }).then((zipBlob) => {
    const now = new Date();

    const result = `DoganLED_${formattedDate(now)}`;

    saveAs(zipBlob, `${result}.zip`);
  });
  displayError.value = false;
  isBlurred.value = false;
  isLoading.value = false;
  selectedFiles.value = [];
};

const downloadSelectedFiles = async () => {
  if (!Array.isArray(selectedFiles.value) || selectedFiles.value.length === 0) {
    console.error("No files selected");
    displayError.value = true;
    return;
  }
  isLoading.value = true;
  for (const fileUrl of selectedFiles.value) {
    try {
      const fileObj = files.value.find((f) => f.webContentLink === fileUrl);
      if (!fileObj) continue;

      const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileObj.id}`;

      // Create an invisible iframe for silent download
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = downloadUrl;

      document.body.appendChild(iframe);

      // Wait for a short time before removing the iframe
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 5000);

      // Add delay between downloads to avoid issues
      await new Promise((resolve) => setTimeout(resolve, 1000));
      displayError.value = false;
      isBlurred.value = false;
      isLoading.value = false;
      selectedFiles.value = [];
    } catch (error) {
      console.error(`Error downloading file ${fileUrl}:`, error);
    }
  }
};

onMounted(() => {
  fetchCategories();
  // fetchAllItems();
});
</script>
