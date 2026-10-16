import { cacheLife } from "next/cache";
import { FOUNDED_YEAR } from "./site";

/**
 * Con Cache Components, `new Date()` no puede leerse en el render estatico
 * sin decidir su ciclo de vida. Se cachea por dias: el año se renueva solo.
 */
export async function getTimeFacts() {
  "use cache";
  cacheLife("days");
  const year = new Date().getFullYear();
  return { year, yearsInBusiness: year - FOUNDED_YEAR };
}
