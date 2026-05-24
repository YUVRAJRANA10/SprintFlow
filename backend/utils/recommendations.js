/**
 * Rule-based recommendation engine for SprintFlow metrics.
 * Generates actionable insights based on DORA and developer metrics.
 */

export function generateRecommendations(metrics, type = 'developer') {
  const recommendations = [];

  if (type === 'developer') {
    // Cycle time recommendations
    if (metrics.cycle_time > 5) {
      recommendations.push({
        category: 'cycle-time',
        status: 'warning',
        title: 'High cycle time detected',
        value: `${metrics.cycle_time} days`,
        threshold: '5 days',
        action: 'Break down larger features into smaller, shippable increments. Consider pair programming for complex tasks.',
        priority: 'high',
      });
    } else if (metrics.cycle_time <= 2) {
      recommendations.push({
        category: 'cycle-time',
        status: 'success',
        title: 'Excellent cycle time',
        value: `${metrics.cycle_time} days`,
        threshold: '< 2 days',
        action: 'Maintain this velocity. Consider sharing your workflow practices with the team.',
        priority: 'low',
      });
    } else {
      recommendations.push({
        category: 'cycle-time',
        status: 'info',
        title: 'Cycle time is healthy',
        value: `${metrics.cycle_time} days`,
        threshold: '2-5 days',
        action: 'Keep optimizing. Look for opportunities to streamline PR reviews.',
        priority: 'medium',
      });
    }

    // PR review wait time
    if (metrics.pr_review_wait > 12) {
      recommendations.push({
        category: 'review-time',
        status: 'warning',
        title: 'Long PR review wait times',
        value: `${metrics.pr_review_wait} hrs`,
        threshold: '< 12 hrs',
        action: 'PRs are waiting too long for review. Increase async communication or schedule pair reviews.',
        priority: 'high',
      });
    } else if (metrics.pr_review_wait <= 4) {
      recommendations.push({
        category: 'review-time',
        status: 'success',
        title: 'Fast PR reviews',
        value: `${metrics.pr_review_wait} hrs`,
        threshold: '< 4 hrs',
        action: 'Great review turnaround. Team collaboration is strong.',
        priority: 'low',
      });
    } else {
      recommendations.push({
        category: 'review-time',
        status: 'info',
        title: 'PR review time is acceptable',
        value: `${metrics.pr_review_wait} hrs`,
        threshold: '4-12 hrs',
        action: 'Keep monitoring. Consider setting review time SLOs.',
        priority: 'medium',
      });
    }

    // Bug rate
    if (metrics.escaped_bugs > 0) {
      recommendations.push({
        category: 'quality',
        status: 'warning',
        title: 'Production bugs detected',
        value: `${metrics.escaped_bugs} bug(s)`,
        threshold: 'zero',
        action: 'Review test coverage and QA processes. Consider adding automated tests for bug-prone areas.',
        priority: 'high',
      });
    } else {
      recommendations.push({
        category: 'quality',
        status: 'success',
        title: 'No escaped bugs',
        value: '0',
        threshold: 'zero',
        action: 'Excellent quality. Maintain current testing practices.',
        priority: 'low',
      });
    }

    // PR throughput
    if (metrics.pr_throughput === 0) {
      recommendations.push({
        category: 'throughput',
        status: 'info',
        title: 'No PR activity this month',
        value: '0 PRs',
        threshold: '> 1',
        action: 'Check if you\'re on deployment or scheduled time off. Plan next deliverable.',
        priority: 'medium',
      });
    } else if (metrics.pr_throughput >= 5) {
      recommendations.push({
        category: 'throughput',
        status: 'success',
        title: 'Strong delivery rate',
        value: `${metrics.pr_throughput} PRs`,
        threshold: '> 5',
        action: 'Excellent throughput. Keep up the momentum.',
        priority: 'low',
      });
    } else {
      recommendations.push({
        category: 'throughput',
        status: 'info',
        title: 'Steady delivery',
        value: `${metrics.pr_throughput} PRs`,
        threshold: '2-5',
        action: 'On track. Aim to maintain or increase this pace.',
        priority: 'medium',
      });
    }
  } else if (type === 'team') {
    // Team cycle time
    if (metrics.avg_cycle_time > 5) {
      recommendations.push({
        category: 'team-cycle-time',
        status: 'warning',
        title: 'Team cycle time is high',
        value: `${metrics.avg_cycle_time} days`,
        threshold: '< 5 days',
        action: 'Host a retrospective to identify bottlenecks. Consider process improvements or skill sharing.',
        priority: 'high',
      });
    } else {
      recommendations.push({
        category: 'team-cycle-time',
        status: 'success',
        title: 'Team cycle time is healthy',
        value: `${metrics.avg_cycle_time} days`,
        threshold: '< 5 days',
        action: 'Excellent team velocity. Document and share best practices.',
        priority: 'low',
      });
    }

    // Deployment frequency
    if (metrics.deployment_frequency >= 10) {
      recommendations.push({
        category: 'deployment-freq',
        status: 'success',
        title: 'High deployment frequency',
        value: `${metrics.deployment_frequency} deploys`,
        threshold: '> 10',
        action: 'Excellent CI/CD practices. Team is shipping frequently.',
        priority: 'low',
      });
    } else if (metrics.deployment_frequency < 3) {
      recommendations.push({
        category: 'deployment-freq',
        status: 'warning',
        title: 'Low deployment frequency',
        value: `${metrics.deployment_frequency} deploys`,
        threshold: '> 10',
        action: 'Consider improving deployment automation or release process.',
        priority: 'high',
      });
    } else {
      recommendations.push({
        category: 'deployment-freq',
        status: 'info',
        title: 'Deployment frequency is moderate',
        value: `${metrics.deployment_frequency} deploys`,
        threshold: '> 10',
        action: 'Look for opportunities to increase deployment automation.',
        priority: 'medium',
      });
    }

    // Team bug rate
    const bugRatePercent = (parseFloat(metrics.bug_rate) * 100).toFixed(2);
    if (metrics.bug_rate > 0.1) {
      recommendations.push({
        category: 'team-quality',
        status: 'warning',
        title: 'Team bug rate is elevated',
        value: `${bugRatePercent}%`,
        threshold: '< 10%',
        action: 'Increase testing rigor and code review standards. Invest in test infrastructure.',
        priority: 'high',
      });
    } else if (metrics.bug_rate === 0) {
      recommendations.push({
        category: 'team-quality',
        status: 'success',
        title: 'Zero bug rate',
        value: '0.00%',
        threshold: '< 10%',
        action: 'Excellent quality bar. Maintain current practices.',
        priority: 'low',
      });
    } else {
      recommendations.push({
        category: 'team-quality',
        status: 'info',
        title: 'Team quality is solid',
        value: `${bugRatePercent}%`,
        threshold: '< 10%',
        action: 'Keep monitoring. Current practices are working well.',
        priority: 'medium',
      });
    }
  }

  return recommendations;
}

export function getRecommendationColor(status) {
  const colorMap = {
    success: '#6fe7c8', // teal
    warning: '#ff9a76', // orange
    info: '#8da2ff', // blue
  };
  return colorMap[status] || '#e0e0e0';
}
