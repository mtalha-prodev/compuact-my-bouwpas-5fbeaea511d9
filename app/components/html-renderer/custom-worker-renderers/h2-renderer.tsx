import { FontAwesomeIcon } from 'app/components/font-awesome-icon';
import { Quota } from 'app/components/make-teams/quota';
import { TQuotaKeyColors } from 'app/components/make-teams/quota.types';
import { StatusTagIcon } from 'app/components/status-tag-icon/status-tag-icon';
import { Text } from 'app/components/text/text';
import { textContent } from 'domutils';
import React from 'react';
import { View } from 'react-native';
import { Node, CustomTextualRenderer } from 'react-native-render-html';

import { TIcon, TColorForTag } from '../status-tags/status.types';

export const H2InfoRenderer: CustomTextualRenderer = React.memo(function H2Inforender({ tnode }) {
  let headingText = '';
  let classNames = [];
  classNames = (tnode.attributes.class ?? '').split(' ');

  function isOfTypeTIcon(value: string): value is TIcon {
    return [
      'trophy',
      'check',
      'times',
      'sparkles',
      'triangle-exclamation',
      'link-slash',
      'spinner',
      'trash',
      'transporter-empty',
    ].includes(value);
  }

  function isOfTypeTColorForTag(value: string): value is TColorForTag {
    return ['red', 'green', 'black', 'cyan', 'grey', 'yellow', 'warning', 'orange'].includes(value);
  }

  function isOfTypeTQuotaKeyColors(value: string): value is TQuotaKeyColors {
    return ['0', '25', '50', '75', '100'].includes(value);
  }

  let statusColor: TColorForTag = 'grey';
  let statusText: any = 'unknown';
  let statusIcon: TIcon = 'transporter-empty';
  let showStatus = false;
  let showQuota = false;
  let quotaColor: TQuotaKeyColors = '0';
  let quotaPercentage = '';

  if (
    classNames.includes('showstatus') &&
    isOfTypeTIcon(tnode.attributes.icon) &&
    isOfTypeTColorForTag(tnode.attributes.color)
  ) {
    showStatus = true;
    statusIcon = tnode.attributes.icon;
    statusColor = tnode.attributes.color;
    statusText = tnode.attributes.statustext ?? 'unknown';
  }
  if (classNames.includes('quota') && isOfTypeTQuotaKeyColors(tnode.attributes.color)) {
    showQuota = true;
    quotaColor = tnode.attributes.color;
    quotaPercentage = tnode.attributes.percentage;
  }

  let icon: any = undefined;
  let colors: any = undefined;
  let colorLevel: any = undefined;
  try {
    headingText = textContent(tnode?.domNode as Node);
    if (classNames.includes('valid')) {
      icon = ['fas', 'check-circle'];
      colors = ['bp-valid', 'bp-valid'];
      colorLevel = ['500', '500'];
    } else if (classNames.includes('invalid')) {
      icon = ['fas', 'times-circle'];
      colors = ['bp-cancel', 'bp-cancel'];
      colorLevel = ['500', '500'];
    } else if (classNames.includes('noStatus')) {
      icon = ['fas', 'info-circle'];
      colors = ['bp-support', 'bp-support'];
      colorLevel = ['400', '400'];
    } else if (classNames.includes('warning') && classNames.includes('yellow')) {
      icon = ['fas', 'rectangle-vertical'];
      colors = ['bp-yellow-card', 'bp-yellow-card'];
      colorLevel = ['600', '600'];
    } else if (classNames.includes('warning') && classNames.includes('red')) {
      icon = ['fas', 'rectangle-vertical'];
      colors = ['bp-red-card', 'bp-red-card'];
      colorLevel = ['600', '600'];
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // user created a header without content, so make the header empty
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: 8,
        marginVertical: 4,
        marginRight: 8,
      }}
      key={Math.random()}
    >
      <Text style={{ fontSize: 20, fontFamily: 'interstate' }}>{headingText}</Text>
      {icon && colors && (
        <FontAwesomeIcon
          icon={icon}
          size={20}
          colors={colors}
          secondaryColors={['bp-support', 'bp-support']}
          colorsLevel={colorLevel}
          secondaryColorsLevel={['500', '500']}
        />
      )}
      {showStatus && statusColor && statusIcon && (
        <StatusTagIcon statusText={statusText} icon={statusIcon} color={statusColor} />
      )}
      {showQuota && quotaColor && quotaPercentage && (
        <Quota percentage={quotaPercentage} backgroundColorData={quotaColor} />
      )}
    </View>
  );
});
