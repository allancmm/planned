import React, {ChangeEvent, useState} from 'react';
import produce from 'immer';
import InputText from "../../../components/general/inputText";
import GitCredentialsRequest from '../../../lib/infra/request/git/gitCredentialsRequest';
import {Loading, Select} from "equisoft-design-ui-elements";

const GitAuthModes = ['Creds', 'Token'] as const;
type GitAuthMode = typeof GitAuthModes[number];

interface GitAuthProps {
    loading: boolean;
    gitAuth: GitCredentialsRequest;
    setGitAuth(gitAuth: GitCredentialsRequest): void;
}

const GitAuth = ({loading, gitAuth, setGitAuth }: GitAuthProps) => {
    const [mode, setMode] = useState<GitAuthMode>('Creds');

    return (
        <>
            <Loading loading={loading} />
            <Select
                label="Connection mode: "
                value={mode}
                options={GitAuthModes.map((g) => ({ label: g, value: g }))}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setMode(e.target.value as GitAuthMode);
                    setGitAuth(
                        produce(gitAuth, (draft) => {
                            draft.username = '';
                            draft.password = '';
                        }),
                    );
                }}
            />
            {(() => {
                switch (mode) {
                    case 'Creds':
                        return (
                            <>
                                <InputText
                                    label="Username: "
                                    type="text"
                                    value={gitAuth.username}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setGitAuth(
                                            produce(gitAuth, (draft) => {
                                                draft.username = e.target.value;
                                            }),
                                        )
                                    }
                                />
                                <InputText
                                    label="Password: "
                                    type="password"
                                    value={gitAuth.password}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setGitAuth(
                                            produce(gitAuth, (draft) => {
                                                draft.password = e.target.value;
                                            }),
                                        )
                                    }
                                />
                            </>
                        );
                    case 'Token':
                        return (
                            <InputText
                                label="Token: "
                                type="password"
                                value={gitAuth.username}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setGitAuth(
                                        produce(gitAuth, (draft) => {
                                            draft.username = e.target.value;
                                            draft.password = e.target.value;
                                        }),
                                    )
                                }
                            />
                        );
                }
            })()}
        </>
    );
};

export default GitAuth;
