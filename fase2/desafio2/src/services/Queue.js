import Bee from 'bee-queue';
import redisConfig from '../config/redis';
import SubscriptionMail from '../app/jobs/SubscriptionMail';

// Service Jobs Registry
const jobs = [SubscriptionMail];

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
    /**
     * It considers that all jobs have key and handle properties
     * bee: Stores the Loaded Queue
     * handle: Stores the method to be executed for that job.
     */
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
   * @param {String} queue - Pre-existed queue name (Job's key property)
   * @param {Object} jobData - Data to be used by the handle job method
   */
  add(queue, jobData) {
    // set the new job on a pre-loaded Queue to be processed further.
    return this.queues[queue].bee.createJob(jobData).save();
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

  /**
   * Handler that will be executed any time that a job fail.
   * @param {Object} job - Job Object reference
   * @param {Object} err - Exception error
   */
  handleFailure(job, err) {
    // throw new Error(`Queue ${job.queue.name}: FAILED`, err);
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
