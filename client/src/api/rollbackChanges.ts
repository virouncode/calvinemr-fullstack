import xanoDelete from "./xanoCRUD/xanoDelete";

export const rollbackChanges = async (
  successfulRequests: { endpoint: string; id: number }[]
) => {
  for (const request of successfulRequests) {
    // Rollback in reverse order
    try {
      await xanoDelete(`${request.endpoint}${request.id}`, "admin");
    } catch (err) {
      console.error(
        `Failed to rollback ${request.endpoint} with id ${request.id}`
      );
    }
  }
};
