const activeJobs = new Map();

export function addJob(id, process) {
  activeJobs.set(id, process);
}

export function getJob(id) {
  return activeJobs.get(id);
}

export function removeJob(id) {
  activeJobs.delete(id);
}

export function listJobs() {
  return Array.from(activeJobs.keys());
}