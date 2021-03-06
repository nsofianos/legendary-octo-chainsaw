import React, { useRef } from 'react';
import { IconButton, ButtonGroup, Tooltip, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TitleIcon from '@material-ui/icons/Title';
import FormatSizeIcon from '@material-ui/icons/FormatSize';
import StopIcon from '@material-ui/icons/Stop';
import ColorLensOutlinedIcon from '@material-ui/icons/ColorLensOutlined';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import BorderClearIcon from '@material-ui/icons/BorderClear';
import BorderStyleIcon from '@material-ui/icons/BorderStyle';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useStoreState } from 'react-flow-renderer';
import '../style/editor.css';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '200px',
    zIndex: 10,
    display: 'flex',
    top: '130px',
    position: 'absolute',
    alignItems: 'center',
    '& > *': {
      marginLeft: theme.spacing(3),
    },
  },
  toolbarGroup: {
    background: '#FFF',
    border: '1px solid darkgrey',
    padding: '4px',
  },
  attributeGroup: {
    paddingTop: '5px',
  },
  nodetext: {
    zIndex: 10,
    postition: 'absolute',
    top:'30px',
    width: '100px',
  }
}));

export default function AttributeToolbar({yDoc}) {
  const classes = useStyles();
  const [menu, setMenu] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const labelRef = useRef();

  const handleOpen = (menu) => {
    setMenu(menu);
    setOpen(true);
  };
  const handleClickAway = () => {
    setOpen(false);
  };


  const selectedElements = useStoreState(store => store.selectedElements);

  const handleUpdateNodeData = (data) => {
    setOpen(false);
    const selectedIds = [];
    if (!selectedElements) return; // Stop if selected elements is empty
    for (const elm of selectedElements) {
      selectedIds.push(elm.id);
    }
    for (const elmMap of yDoc.current.getArray('elements')) {
      if (selectedIds.includes(elmMap.get('id')) && ['ShapeNode', 'HandleNode'].includes(elmMap.get('type'))) {
        elmMap.set('data', {...elmMap.get('data'), ...data});
      }
    }
  }

  return (

    <div className={classes.root}>

      <ButtonGroup className={classes.toolbarGroup} orientation="vertical" variant="outlined" color="default">
        <Tooltip title="Change Color" placement="right">
          <IconButton className={classes.attributeGroup} size='small' onClick={() => handleOpen('color')}>
            <ColorLensOutlinedIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Fill Style" placement="right">
          <IconButton className={classes.attributeGroup} size='small' onClick={() => handleOpen('fill')}>
            <BorderStyleIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Change Text" placement="right">
          <IconButton className={classes.attributeGroup} size='small' onClick={() => handleOpen('text')}>
            <TitleIcon/>
          </IconButton>
        </Tooltip>
        <Tooltip title="Text Size" placement="right">
          <IconButton className={classes.attributeGroup} size='small' onClick={() => handleUpdateNodeData('default', 'screenblock')}>
            <FormatSizeIcon/>
          </IconButton>
        </Tooltip>
      </ButtonGroup>

      {/* Color picker */}
      {open && menu === 'color' &&
      <ClickAwayListener onClickAway={handleClickAway}>
        <ButtonGroup id='colorPanel' className={classes.toolbarGroup} orientation="vertical" variant="outlined" color="default">
          <IconButton size='small' onClick={() => handleUpdateNodeData({fillColor:'dark'})}>
            <FiberManualRecordIcon className="dark"/>
          </IconButton>
          <IconButton size='small' onClick={() => handleUpdateNodeData({fillColor:'light'})}>
            <FiberManualRecordIcon className="light"/>
          </IconButton>
          <IconButton size='small' onClick={() => handleUpdateNodeData({fillColor:'red'})}>
            <FiberManualRecordIcon className="red"/>
          </IconButton>
          <IconButton size='small' onClick={() => handleUpdateNodeData({fillColor:'green'})}>
            <FiberManualRecordIcon className="green"/>
          </IconButton>
          <IconButton size='small' onClick={() => handleUpdateNodeData({fillColor:'blue'})}>
            <FiberManualRecordIcon className="blue"/>
          </IconButton>
          <IconButton size='small' onClick={() => handleUpdateNodeData({fillColor:'purple'})}>
            <FiberManualRecordIcon className="darkblue"/>
          </IconButton>
        </ButtonGroup>
      </ClickAwayListener> }

      {/* Fill Style */}
      {open && menu === 'fill' &&
      <ClickAwayListener onClickAway={handleClickAway}>
        <ButtonGroup id='fillPanel' className={classes.toolbarGroup} orientation="vertical" variant="outlined" color="default">
          <Tooltip title="Dotted Edge" placement="right">
            <IconButton size='small' onClick={() => handleUpdateNodeData({fillStyle: 'dashed'})}>
              <BorderClearIcon/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Filled" placement="right">
            <IconButton size='small' onClick={() => handleUpdateNodeData({fillStyle: 'filled'})}>
              <StopIcon fontSize='large'/>
            </IconButton>
          </Tooltip>
          <Tooltip title="Outlined" placement="right">
            <IconButton size='small' onClick={() => handleUpdateNodeData({fillStyle: 'outlined'})}>
              <CheckBoxOutlineBlankIcon />
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </ClickAwayListener> }

      {/* Text Edit */}
      {open && menu === 'text' &&
      <ClickAwayListener onClickAway={handleClickAway}>
        <TextField inputRef={labelRef} onKeyPress={(e) => {
            if (e.key === 'Enter') {
              console.log('Enter key pressed');
              handleUpdateNodeData({label: labelRef.current.value})
            }
    }} className={classes.nodetext} id="outlined-basic" multiline label="Node Text" variant="filled" />
      </ClickAwayListener>
      }
    </div>
  );
}
