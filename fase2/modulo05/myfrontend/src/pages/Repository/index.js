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
    };
  }

  async componentDidMount() {
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);

    const [myRepo, myIssues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: 'open',
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: myRepo.data,
      issues: myIssues.data,
      loading: false,
    });
  }

  render() {
    const { repository, issues, loading } = this.state;

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
