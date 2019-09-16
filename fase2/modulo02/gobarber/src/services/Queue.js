import Bee from 'bee-queue';
import redisConfig from '../config/redis';
import CancellationMail from '../app/jobs/CancellationMail';

// Service Jobs List
const jobs = [CancellationMail];

/**
 * Background Queue Service Manager
 * @author Leonardo Otoni
 */
class Queue {
  constructor() {
    this.queues = {};
    this.init();
  }

  /**
   * Load all Service jobs and their respective handler methods
   */
  async init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  /**
   * Add a new Job on the background queue.
   * @param {Pre-existed queue name} queue
   * @param {Activities to perform} job
   */
  add(queue, job) {
    // set the new job on a pre-loaded Queue to be processed further.
    return this.queues[queue].bee.createJob(job).save();
  }

  /**
   * Execute jobs for all loaded queues
   * This method must not be invoked for application main process
   */
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];
      bee.process(handle);
    });
  }
}

export default new Queue();
