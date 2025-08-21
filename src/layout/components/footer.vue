<script setup lang="ts">
// import { useNav } from "@/layout/hooks/useNav";
// import topCollapse from "./sidebar/topCollapse.vue";
// import { useTranslationLang } from "../hooks/useTranslationLang";
import Logo_blue from "@/assets/svg/logo_blue.svg?component";
import Twitter from "@/assets/svg/twitter.svg?component";
import Discord from "@/assets/svg/discord.svg?component";
import Email from "@/assets/svg/email.svg?component";
import Telegram from "@/assets/svg/telegram.svg?component";
import Media from "@/assets/svg/media.svg?component";
import Installgram from "@/assets/svg/installgram.svg?component";
import Camera from "@/assets/svg/camera.svg?component";
import Youtube from "@/assets/svg/youtube.svg?component";
// const {
//   t
//   // locale,
//   // translationCh,
//   // translationEn
// } = useTranslationLang();
</script>

<template>
  <div class="bg-[#F8FAFD] shadow-lg w-full spaec">
    <div
      class="flex flex-col md:max-w-[1200px] w-11/12 mx-auto font-sofia font-bold text-[12px] py-8"
    >
      <div class="flex md:flex-row flex-col w-full">
        <div class="flex flex-col md:pb-0 pb-3 md:w-2/5">
          <!-- <Logo_blue /> -->
          <img
            class="w-[200px] h-[34.4px]"
            src="@/assets/yz_img/logo_icon_B.png"
          />
          <div class="flex items-center gap-3 my-4">
            <el-link
              href="https://x.com/onechainlabs"
              target="_blank"
              :underline="false"
            >
              <el-tooltip effect="dark" content="Twitter" placement="bottom">
                <Twitter class="cursor-pointer" />
              </el-tooltip>
            </el-link>
            <el-link
              href="https://discord.gg/QdeVgZrCEX"
              target="_blank"
              :underline="false"
            >
              <el-tooltip effect="dark" content="Discord" placement="bottom">
                <Discord class="cursor-pointer" />
              </el-tooltip>
            </el-link>
            <el-link
              href="mailto:contact@onelabs.cc"
              target="_blank"
              :underline="false"
            >
              <el-tooltip effect="dark" content="Email" placement="bottom">
                <Email class="cursor-pointer" />
              </el-tooltip>
            </el-link>
            <el-link
              href="https://t.me/hello_onechain"
              target="_blank"
              :underline="false"
            >
              <el-tooltip effect="dark" content="Telegram" placement="bottom">
                <Telegram class="cursor-pointer" />
              </el-tooltip>
            </el-link>
            <el-link
              href="https://onechain.medium.com/"
              target="_blank"
              :underline="false"
            >
              <el-tooltip effect="dark" content="medium" placement="bottom">
                <Media class="cursor-pointer" />
              </el-tooltip>
            </el-link>
            <el-link
              href="https://www.linkedin.com/company/onechainlabs"
              target="_blank"
              :underline="false"
            >
              <el-tooltip effect="dark" content="LinkIn" placement="bottom">
                <Installgram class="cursor-pointer" />
              </el-tooltip>
            </el-link>
            <el-link
              href="https://instagram.com/onechainlabs"
              target="_blank"
              :underline="false"
            >
              <el-tooltip
                effect="dark"
                content="Installgram"
                placement="bottom"
              >
                <Camera class="cursor-pointer" />
              </el-tooltip>
            </el-link>
            <el-link
              href="https://www.youtube.com/@One-Chain"
              target="_blank"
              :underline="false"
            >
              <el-tooltip effect="dark" content="Youtube" placement="bottom">
                <Youtube class="cursor-pointer" />
              </el-tooltip>
            </el-link>
          </div>
          <span class="text-[14px] text-[#99A0AD] weight_500">
            OneScan is a Block Explorer and Analytic Platform for OneChain, a
            next generation financial market infrastructure for everyone.
          </span>
        </div>
        <div
          class="flex md:w-3/5 md:justify-end md:pt-0 pt-3 md:border-none border-t-[1px] border-dashed border-gray-300"
        >
          <div class="flex flex-col text-sm">
            <span class="text-[#99A0AD]">About Us</span>
            <ul class="text-[#000000]">
              <li class="mt-4 cursor-pointer weight_500">
                <a href="https://termsofservice.onelabs.cc" target="_blank"
                  >Terms of Service</a
                >
              </li>
              <li class="mt-4 cursor-pointer weight_500">
                <a href="https://privacypolicy.onelabs.cc" target="_blank"
                  >Privacy Policy</a
                >
              </li>
            </ul>
          </div>
          <div class="flex flex-col ml-20 text-sm">
            <span class="text-[#99A0AD] weight_500">Developer Center </span>
            <ul class="text-[#000000] weight_500">
              <li class="mt-4 cursor-pointer">
                <a href="https://docs.onelabs.cc/API" target="_blank"
                  >API Document</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full h-[1px] bg-[#E9ECEF]" />
    <div
      class="md:max-w-[1200px] w-11/12 mx-auto py-4 text-[14px] text-[#99A0AD] weight_500"
    >
      OneChain © 2025 All rights reserved
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footer {
  width: 100%;
  overflow: hidden;
}
.weight_500 {
  font-weight: 500 !important;
}
</style>
