import { createPinia, defineStore } from "pinia";
import { createUnistorage } from "pinia-plugin-unistorage";
import { reactive, toRefs } from "vue";
import type { UserStoreStateInterface } from "@/types/types/store";

const pinia = createPinia();
pinia.use(createUnistorage());

export const UserStore = defineStore(
  "gxbuy_uniapp_user_store",
  () => {
    const state = reactive<UserStoreStateInterface>({
      gxbuy_uniapp_jwt: "",
      userInfo: {},
      toPath: ""
    });

    return {
      ...toRefs(state)
    };
  },
  {
    unistorage: true
  }
);

export default pinia;
