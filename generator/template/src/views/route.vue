<template>
  <div class="router mt-4 ml-4">
    <h1 class="text-xl">路由列表（试试看新增/删除 views 下的文件试试看）：</h1>
    <section class="mt-4 text-blue-500">
      <pre>{{ JSON.stringify($router.options.routes, null, 2) }}</pre>
    </section>
  </div>
</template>

