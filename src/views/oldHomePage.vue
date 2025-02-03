<template>
    <v-container class="main-container">
      <v-toolbar-title class="toolbar-title">
        <h1>DOĞANLED AYDINLATMA SISTEMLERİ</h1>
      </v-toolbar-title>
      <v-row justify="center">
        <v-col cols="12" md="6">
          <!-- {{ selectedCategory }}
          <v-select
            label="Kategori Seciniz"
            :items="categories.map((category) => category.name)"
            v-model="selectedCategory"
            @click="console.log('selectedCategory')"
            @ch
          ></v-select> -->
          <div>
            <label>Kategori:</label>
            <select
              v-model="selectedCategory"
              @change="fetchNextLevel(selectedCategory, 0)"
              placeholder="Seçiniz"
            >
              <option
                v-for="category in categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
          <div v-for="(step, index) in selectionSteps" :key="index">
            <select
              v-model="selectedValues[index]"
              @change="fetchNextLevel(selectedValues[index], index + 1)"
            >
              <option
                v-for="option in step.options"
                :key="option.id"
                :value="option.id"
                placeholder="Seçiniz"
              >
                {{ option.name }}
              </option>
            </select>
          </div>
  
          <!-- Dynamic Select Boxes
          <div v-for="(step, index) in selectionSteps" :key="index">
            <v-select
              v-model="selectedValues[index]"
              @change="fetchNextLevel(selectedValues[index], index + 1)"
              :options="step.options"
            >
            </v-select>
          </div> -->
          <!-- Size Selection -->
          <!-- <v-select
            :disabled="sizeOptions.length === 0"
            v-model="selectedSize"
            :items="sizeOptions"
            label="Boyut"
            outlined
          ></v-select> -->
  
          <!-- Watt Selection -->
          <!-- <v-select
            :disabled="wattOptions.length === 0"
            v-model="selectedWatt"
            :items="wattOptions"
            label="Watt"
            outlined
          ></v-select> -->
  
          <!-- Mounting Type Selection -->
          <!-- <v-select
            :disabled="mountingTypeOptions.length === 0"
            v-model="selectedMountingType"
            :items="mountingTypeOptions"
            label="Montaj Tipi"
            outlined
          ></v-select> -->
  
          <!-- File Selection and Download -->
          <v-select
            :disabled="files.length === 0"
            v-model="selectedFiles"
            :items="files"
            item-title="name"
            item-value="webContentLink"
            label="Dosyalar"
            multiple
            outlined
          >
            <template v-slot:prepend-item>
              <v-list-item
                @click="selectAllFiles"
                :key="'select-all'"
                :value="null"
              >
                <v-list-item-content>
                  <v-list-item-title>Hepsini seç</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-select>
  
          <!-- Download Button -->
          <!-- :disabled="!selectedFiles.length" -->
          <v-btn
            style="display: block"
            class="mb-4"
            @click="downloadFilesAsZip"
            :disabled="
              !(Array.isArray(selectedFiles) && selectedFiles.length > 0)
            "
          >
            Dosyaları zip olarak indir
          </v-btn>
          <v-btn
            style="display: block"
            @click="downloadSelectedFiles"
            :disabled="
              !(Array.isArray(selectedFiles) && selectedFiles.length > 0)
            "
          >
            Dosyaları ayrı ayrı indir
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </template>
  <script setup>
  import { ref, onMounted } from "vue";
  import JSZip from "jszip";
  import { saveAs } from "file-saver";
  import axios from "axios";
  
  const categories = ref([]);
  const selectionSteps = ref([]);
  const selectedCategory = ref("");
  const selectedValues = ref([]);
  const files = ref([]);
  const selectedFiles = ref([]);
  const selectAll = ref(false);
  const apiKey = "AIzaSyDNn-oguslOMXTW1TjLoQfdKvcmlZbhiCg";
  const rootFolderId = "1xfdXsdwpuYlHjMjw2B4wlAnpOgv4UYWY";
  
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
  
      selectedFiles.value = []; // Reset selection when new files are fetched
      selectAll.value = false;
    } catch (error) {
      console.error("Error fetching files:", error);
      files.value = [];
    }
  };
  
  const fetchCategories = async () => {
    categories.value = await fetchFolders(rootFolderId);
  };
  
  const fetchNextLevel = async (parentId, level) => {
    if (!parentId) return;
  
    const folders = await fetchFolders(parentId);
    console.log(folders);
  
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
  
  const toggleSelectAll = () => {
    selectedFiles.value = selectAll.value ? [...files.value] : [];
  };
  const downloadFilesAsZip = async () => {
    if (!Array.isArray(selectedFiles.value) || selectedFiles.value.length === 0) {
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
      saveAs(zipBlob, "downloaded_files.zip");
    });
  };
  // const downloadFilesAsZip = async () => {
  //   if (!Array.isArray(selectedFiles.value) || selectedFiles.value.length === 0) {
  //     console.error("No files selected");
  //     return;
  //   }
  
  //   const zip = new JSZip();
  
  //   try {
  //     for (const fileUrl of selectedFiles.value) {
  //       const fileObj = files.value.find((f) => f.webContentLink === fileUrl);
  //       if (!fileObj) continue;
  
  //       // Directly use the webContentLink (no need to redeclare 'fileUrl')
  //       const fileContentUrl = fileObj.webContentLink; // Renamed to avoid conflict
  
  //       // Fetch the file using its public URL
  //       const response = await fetch(fileContentUrl);
  //       console.log(response);
  //       const blob = await response.blob();
  
  //       // Add the file to the ZIP archive
  //       zip.file(fileObj.name, blob);
  //     }
  
  //     // Generate the ZIP file and trigger the download
  //     const content = await zip.generateAsync({ type: "blob" });
  //     saveAs(content, "downloaded_files.zip");
  //   } catch (error) {
  //     console.error("Error creating ZIP file:", error);
  //   }
  // };
  
  const downloadSelectedFiles = async () => {
    if (!Array.isArray(selectedFiles.value) || selectedFiles.value.length === 0) {
      console.error("No files selected");
      return;
    }
  
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
      } catch (error) {
        console.error(`Error downloading file ${fileUrl}:`, error);
      }
    }
  };
  
  const selectAllFiles = () => {
    if (selectedFiles.value.length === files.value.length) {
      selectedFiles.value = [];
    } else {
      selectedFiles.value = files.value.map((file) => file.webContentLink);
    }
  };
  onMounted(() => {
    fetchCategories();
  });
  // const fileNames = computed(() => {
  //   return files.value.map((file) => file.name);
  // });
  </script>
  <!-- 
  <script setup>
  import { ref, onMounted, watch, computed } from "vue";
  import axios from "axios";
  
  import JSZip from "jszip";
  import { saveAs } from "file-saver";
  
  const allProducts = ref([]);
  
  const selectedCategory = ref(null);
  const selectedCategory = ref(null);
  const mountingTypeOptions = ref([]);
  const selectedValues = ref(null);
  const fileOptions = ref([]);
  const selectedFiles = ref(null);
  const apiKey = "AIzaSyDNn-oguslOMXTW1TjLoQfdKvcmlZbhiCg";
  const rootFolderId = "1xfdXsdwpuYlHjMjw2B4wlAnpOgv4UYWY";
  
  const fetchAllProducts = async () => {
    try {
      allProducts.value = await fetchFolders(rootFolderId);
      console.log(allProducts.value);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  onMounted(fetchAllProducts);
  async function fetchFolders(parentId) {
    try {
      const url = `https://www.googleapis.com/drive/v3/files?q='${parentId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&fields=files(id,name)&key=${apiKey}`;
      const response = await axios.get(url);
      return response.data.files || [];
    } catch (error) {
      console.error("Error fetching folders:", error);
      return [];
    }
  }
  
  async function fetchFiles(parentId) {
    try {
      const url = `https://www.googleapis.com/drive/v3/files?q='${parentId}'+in+parents+and+(mimeType='application/pdf' or mimeType='application/vnd.google-apps.shortcut')&fields=files(id,name,mimeType,shortcutDetails)&key=${apiKey}`;
      const response = await axios.get(url);
  
      fileOptions.value = response.data.files.map((file) => ({
        id: file.shortcutDetails ? file.shortcutDetails.targetId : file.id,
        name: file.name,
        webContentLink: `https://drive.google.com/uc?id=${
          file.shortcutDetails ? file.shortcutDetails.targetId : file.id
        }`,
      }));
  
      selectedFiles.value = []; // Reset selection when new files are fetched
      // selectAll = false;
    } catch (error) {
      console.error("Error fetching files:", error);
      selectedFiles.value = [];
    }
  }
  
  async function fetchProducts() {
    products = await fetchFolders(rootFolderId);
    console.log(await fetchFolders(rootFolderId));
  }
  
  async function fetchNextLevel(parentId, level) {
    if (!parentId) return;
  
    const folders = await fetchFolders(parentId);
  
    if (folders.length > 0) {
      selectionSteps = selectionSteps.slice(0, level);
      selectionSteps.push({
        label: `Option ${level + 1}`,
        options: folders,
      });
      selectedValues = selectedValues.slice(0, level);
      files = [];
    } else {
      selectionSteps = selectionSteps.slice(0, level);
      selectedValues = selectedValues.slice(0, level);
      await fetchFiles(parentId);
    }
  }
  const selectAllFiles = () => {
    if (selectedFiles.value.length === fileOptions.value.length) {
      // If already all files are selected, deselect them
      selectedFiles.value = [];
    } else {
      // Otherwise, select all files
      selectedFiles.value = fileOptions.value.map((option) => option);
    }
  };
  
  const downloadSelectedFilesAsZip = () => {
    const zip = new JSZip();
    // const filePromises = selectedFiles.value.map((file) => {
    //   const fileRef = fbRef(
    //     storage,
    //     `products/${selectedCategory.value}/${selectedSize.value}/${selectedWatt.value}/${selectedMountingType.value}/${file}`
    //   );
  
    //   return getDownloadURL(fileRef).then((url) => {
    //     return fetch(url)
    //       .then((response) => response.blob())
    //       .then((blob) => {
    //         zip.file(file, blob);
    //       });
    //   });
    // });
  
    // Promise.all(filePromises).then(() => {
    //   zip.generateAsync({ type: "blob" }).then((content) => {
    //     saveAs(
    //       content,
    //       `${selectedCategory.value}_${selectedSize.value}_${selectedWatt.value}W_${selectedMountingType.value}_files.zip`
    //     );
    //   });
    // });
  };
  
  const downloadSelectedFiles = () => {
    // selectedFiles.value.forEach((file) => {
    //   const fileRef = fbRef(
    //     storage,
    //     `products/${selectedCategory.value}/${selectedSize.value}/${selectedWatt.value}/${selectedMountingType.value}/${file}`
    //   );
    //   getDownloadURL(fileRef).then((url) => {
    //     const xhr = new XMLHttpRequest();
    //     xhr.responseType = "blob";
    //     xhr.onload = (event) => {
    //       const blob = xhr.response;
    //       const a = document.createElement("a");
    //       const url = window.URL.createObjectURL(blob);
    //       a.href = url;
    //       a.download = file; // Set the file name here
    //       document.body.appendChild(a);
    //       a.click();
    //       setTimeout(() => {
    //         document.body.removeChild(a);
    //         window.URL.revokeObjectURL(url); // Clean up the URL object
    //       }, 0);
    //     };
    //     xhr.open("GET", url);
    //     xhr.send();
    //   });
    // });
  };
  
  // const fetchOptions = (type) => {
  //   let refPath = "";
  //   switch (type) {
  //     case "size":
  //       refPath = selectedCategory.value;
  //       break;
  //     case "watt":
  //       refPath = `${selectedCategory.value}/${selectedSize.value}`;
  //       break;
  //     case "mountingType":
  //       refPath = `${selectedCategory.value}/${selectedSize.value}/${selectedWatt.value}`;
  //       break;
  //     case "file":
  //       refPath = `${selectedCategory.value}/${selectedSize.value}/${selectedWatt.value}/${selectedMountingType.value}`;
  //       break;
  //   }
  
  //   const ref = fbRef(productRef, refPath);
  //   listAll(ref).then((res) => {
  //     switch (type) {
  //       case "size":
  //         sizeOptions.value = res.prefixes.map((item) => item.name);
  //         break;
  //       case "watt":
  //         wattOptions.value = res.prefixes.map((item) => item.name);
  //         break;
  //       case "mountingType":
  //         mountingTypeOptions.value = res.prefixes.map((item) => item.name);
  //         break;
  //       case "file":
  //         fileOptions.value = [];
  //         res.items.forEach(async (itemRef) => {
  //           const url = await getDownloadURL(itemRef);
  //           fileOptions.value.push({ name: itemRef.name, url });
  //         });
  //         break;
  //     }
  //   });
  // };
  
  
  // watch(selectedCategory, (newVal) => {
  //   if (newVal) {
  //     //file handling
  
  //     selectedSize.value = null;
  //     sizeOptions.value = [];
  //     selectedWatt.value = null;
  //     wattOptions.value = [];
  //     mountingTypeOptions.value = [];
  //     selectedMountingType.value = null;
  //     selectedFiles.value = [];
  //     fileOptions.value = [];
  
  //     fetchOptions("size");
  //   }
  // });
  // watch(selectedSize, (newVal) => {
  //   if (newVal) {
  //     selectedWatt.value = null;
  //     wattOptions.value = [];
  //     mountingTypeOptions.value = [];
  //     selectedMountingType.value = null;
  //     selectedFiles.value = [];
  //     fileOptions.value = [];
  //     fetchOptions("watt");
  //   }
  // });
  // watch(selectedWatt, (newVal) => {
  //   if (newVal) {
  //     mountingTypeOptions.value = [];
  //     selectedMountingType.value = null;
  //     selectedFiles.value = [];
  //     fileOptions.value = [];
  //     fetchOptions("mountingType");
  //   }
  // });
  // watch(selectedMountingType, (newVal) => {
  //   if (newVal) {
  //     selectedFiles.value = [];
  //     fileOptions.value = [];
  //     fetchOptions("file");
  //   }
  // });
  
  // onMounted(fetchAllProducts);
  </script> -->
  <style scoped>
  .toolbar-title {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
    color: #124094;
    text-transform: none !important;
  }
  .toolbar-title h1 {
    text-wrap: wrap;
    text-align: center;
    font-weight: 400;
    text-transform: none !important;
  }
  
  .main-container {
    margin-top: 1rem;
    border-image: linear-gradient(
        120deg,
        #87b702 0%,
        #124094 20%,
        #87b702 40%,
        #124094 60%,
        #87b702 80%,
        #124094 100%
      )
      1;
    border-width: 0.6rem;
    border-style: solid;
  }
  select {
    border: black 2px solid;
  }
  @media only screen and (max-width: 800px) {
    h1 {
      font-size: 20px;
    }
    .main-container {
      margin-top: 0;
    }
  }
  </style>
  