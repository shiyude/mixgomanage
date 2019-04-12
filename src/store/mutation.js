export default {
  changeSite(state, Site) {
    state.Site = Site;
    try {
      sessionStorage.Site = Site
    } catch (e) {}
  }
}
