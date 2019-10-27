import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import { Loading, Owner, IssueList } from './styles';
import Container from '../../components/Container';

// import { Container } from './styles';
class Repository extends PureComponent {
  constructor() {
    super();
    this.state = {
      repository: {},
      issues: [],
      loading: true,
      states: { all: 'all', open: 'open', closed: 'closed' },
      selectedState: 'all',
      page: 1,
    };
  }

  async componentDidMount() {
    this.fecthDataFromAPI();
  }

  fecthDataFromAPI = async () => {
    const { selectedState, page } = this.state;
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);

    const [myRepo, myIssues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: selectedState,
          per_page: 10,
          page,
        },
      }),
    ]);

    this.setState({
      repository: myRepo.data,
      issues: myIssues.data,
      loading: false,
    });
  };

  selectChangeHandler = async event => {
    await this.setState({ selectedState: event.target.value });
    this.fecthDataFromAPI();
  };

  previousPageHandler = async () => {
    const { page } = this.state;
    this.setState({ page: page - 1 });
    await this.fecthDataFromAPI();
  };

  nextPageHandler = async () => {
    const { page } = this.state;
    this.setState({ page: page + 1 });
    await this.fecthDataFromAPI();
  };

  render() {
    const { repository, issues, loading, states, page } = this.state;
    const disabled = page === 1;

    if (loading) {
      return <Loading>Loading...</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Back to repositories</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <select onChange={this.selectChangeHandler}>
          <option value={states.all}>All</option>
          <option value={states.open}>Open</option>
          <option value={states.closed}>Closed</option>
        </select>
        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href="{issue.html_url}">{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
        <button
          type="button"
          onClick={this.previousPageHandler}
          disabled={disabled}
        >
          Previous
        </button>
        <button type="button" onClick={this.nextPageHandler}>
          Next
        </button>
      </Container>
    );
  }
}

export default Repository;

Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};
