let defaultSite = '/home/appHomeModule.html'
try {
  if (sessionStorage.Site) {
    defaultSite = sessionStorage.Site
  }
} catch(e) {}

export default {
  Site: defaultSite
}