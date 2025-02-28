import * as d3 from "d3";

// Utility functions
export const getUtcTime = date => utcDate(date).getTime();
export const utcDate = (date) => d3.utcDay.floor(date ? new Date(date) : new Date());

// Load data files
export async function loadData() {
  try {
    // In Observable Framework, we use FileAttachment for local files
    const planlets = await FileAttachment("src/dataloaders/data/planlets.json").json();
    const cards = await FileAttachment("src/dataloaders/data/cards.json").json();
    
    console.log("Loaded planlets:", planlets);
    console.log("Loaded cards:", cards);
    
    // Process data
    const activities_overdue = planlets
      .filter(d => d.kind === 0)
      .filter(d => !d.is_parent)
      .filter(d => d.state !== 1)
      .filter(d => getUtcTime(d.end_date) < getUtcTime())
      .map(d => ({
        name: d.name,
        days: d3.timeDay.count(utcDate(d.end_date), utcDate())
      }));
    
    const activities_done_delayed = planlets
      .filter(d => d.kind === 0)
      .filter(d => !d.is_parent)
      .filter(d => d.state === 1)
      .filter(d => getUtcTime(d.done_date) > getUtcTime(d.end_date))
      .map(d => ({
        name: d.name,
        days: d3.timeDay.count(utcDate(d.end_date), utcDate(d.done_date))
      })).concat({ name: 'Dummy', days: 2000});
    
    const milestones_overdue = planlets
      .filter(d => d.kind === 1)
      .filter(d => !d.is_parent)
      .filter(d => d.state !== 1)
      .filter(d => getUtcTime(d.end_date) < getUtcTime())
      .map(d => ({
        name: d.name,
        days: d3.timeDay.count(utcDate(d.end_date), utcDate())
      }));
    
    const milestones_done_delayed = planlets
      .filter(d => d.kind === 1)
      .filter(d => !d.is_parent)
      .filter(d => d.state === 1)
      .filter(d => d.done_date && d.end_date)
      .filter(d => getUtcTime(d.done_date) > getUtcTime(d.end_date))
      .map(d => ({
        name: d.name,
        days: d3.timeDay.count(utcDate(d.end_date), utcDate(d.done_date))
      }));
    
    const cards_overdue = cards.map(d => ({
      name: d.title,
      days: d3.timeDay.count(utcDate(d.due_date), utcDate())
    }))
    .filter(d => d.days > 0);
    
    return {
      activities_overdue,
      activities_done_delayed,
      milestones_overdue,
      milestones_done_delayed,
      cards_overdue
    };
  } catch (error) {
    console.error("Error loading data:", error);
    // Return empty arrays as fallback
    return {
      activities_overdue: [],
      activities_done_delayed: [],
      milestones_overdue: [],
      milestones_done_delayed: [],
      cards_overdue: []
    };
  }
} 