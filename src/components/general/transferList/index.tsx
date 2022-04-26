import React, {useContext, useEffect, useState} from 'react';
import {  Grid, List, Card, CardHeader, ListItem,
           ListItemIcon, Checkbox, Button, Divider } from '@material-ui/core';
import { CheckBox as CheckBoxIcon} from '@material-ui/icons';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Label from "../label";
import { DarkTheme, DesignThemeContext, LightTheme } from "equisoft-design-ui-elements";

const not = (a: string[], b: string[]) => {
    return a.filter((value) => b.indexOf(value) === -1);
}

const intersection = (a: string[], b: string[]) => {
    return a.filter((value) => b.indexOf(value) !== -1);
}

const union = (a: string[], b: string[]) => {
    return [...a, ...not(b, a)];
}

const CheckedBoxIcon = () => <CheckBoxIcon style={{fill: "#006296"}} />;

interface TransferListProps {
    listChoices: string[],
    listChosen: string[],
    titleChoices: string,
    titleChosen: string,
    label: string,
    onChange: Function
}

const TransferList = ({ listChoices, listChosen, titleChoices, titleChosen, label, onChange } : TransferListProps) => {
    const { theme } = useContext(DesignThemeContext);

    const currentTheme = theme === 'light' ? LightTheme : DarkTheme;

    const useStyles = makeStyles((materialTheme: Theme) =>
        createStyles({
            root: {
                margin: 'auto',
            },
            label: {
                marginBottom: 7
            },
            cardContainer: {
                background: currentTheme.colors.background.nav
            },
            cardHeader: {
                padding: materialTheme.spacing(1, 2),
            },
            list: {
                width: 350,
                height: 280,
                backgroundColor: currentTheme.colors.background.nav,
                overflow: 'auto',
            },
            button: {
                margin: materialTheme.spacing(0.5, 0),
                backgroundColor: currentTheme.colors.background.nav,
                '& span': {
                    color: currentTheme.colors.text.primary
                },
            },

        }),
    );

    const [left, setLeft] = useState<string[]>([]);
    const [right, setRight] = useState<string[]>([]);

    const classes = useStyles();

    const [checked, setChecked] = useState<string[]>([]);

    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const numberOfChecked = (items: string[]) => intersection(checked, items).length;

    const handleToggleAll = (items: string[]) => () => {
        if (numberOfChecked(items) === items.length) {
            setChecked(not(checked, items));
        } else {
            setChecked(union(checked, items));
        }
    };

    const handleCheckedRight = () => {
        setRight(right.concat(leftChecked));
        setLeft(not(left, leftChecked));
        setChecked(not(checked, leftChecked));
    };

    const handleCheckedLeft = () => {
        setLeft(left.concat(rightChecked));
        setRight(not(right, rightChecked));
        setChecked(not(checked, rightChecked));
    };

    useEffect(() => setLeft(listChoices), [listChoices]);

    useEffect(() => setRight(listChosen), [listChosen]);

    useEffect(() => {
        onChange(right);
    }, [right]);

    const customList = (title: string, items: string[]) => (
        <Card className={classes.cardContainer}>
            <CardHeader
                className={classes.cardHeader}
                avatar={
                    <Checkbox
                        onClick={handleToggleAll(items)}
                        checked={numberOfChecked(items) === items.length && items.length !== 0}
                        indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
                        disabled={items.length === 0}
                        inputProps={{ 'aria-label': 'all items selected' }}
                        checkedIcon={<CheckedBoxIcon />}
                    />
                }
                title={<Label text={title} />}
                subheader={<Label text={`${numberOfChecked(items)}/${items.length} selected`} /> }
            />
            <Divider />
            <List className={classes.list} dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-all-item-${value}-label`;
                    return (
                        <ListItem key={value} role="listItem" button onClick={handleToggle(value)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checked.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                    checkedIcon={<CheckedBoxIcon />}
                                />
                            </ListItemIcon>
                            <Label text={value}/>
                        </ListItem>
                    );
                })}
                <ListItem />
            </List>
        </Card>
    );

    return (
        <Grid container justify="center" alignItems="center" className={classes.root}>
            <Grid item xs={12} className={classes.label}><Label text={label} /></Grid>
            <Grid item xs={12}>
                <Grid container justify="center" alignItems="center" className={classes.root}>
                    <Grid item xs={12} sm={5}>{customList(titleChoices, left)}</Grid>
                    <Grid item xs={12} sm={2}>
                        <Grid container>
                            <Grid container direction="column" alignItems="center">
                                <Button
                                    variant="outlined"
                                    size="small"
                                    className={classes.button}
                                    onClick={handleCheckedRight}
                                    disabled={leftChecked.length === 0}
                                    aria-label="move selected right"
                                >
                                    &gt;
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    className={classes.button}
                                    onClick={handleCheckedLeft}
                                    disabled={rightChecked.length === 0}
                                    aria-label="move selected left"
                                >
                                    &lt;
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={5}>{customList(titleChosen, right)}</Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
TransferList.defaultProps = {
    listChoices : [],
    listChosen: [],
    titleChoices: "",
    titleChosen: "",
    label: "",
    onChange: () => null
};

export default TransferList;
