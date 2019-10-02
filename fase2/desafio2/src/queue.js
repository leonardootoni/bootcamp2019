/**
 * Entry point to process pending jobs on the application.
 * It must to run in a different process from the application for performance.
 * @author Leonardo Otoni
 */
import 'dotenv/config';
import Queue from './services/Queue';

Queue.processQueue();
