export default defineNuxtPlugin(() => {
    const router = useRouter();
  
    router.beforeEach((to, from, next) => {
      console.log(`Navigating from ${from.fullPath} to ${to.fullPath}`);
      next();
    });
  });
  