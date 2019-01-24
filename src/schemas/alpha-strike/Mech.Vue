<template>
  <mech>
    <row>
      <column>
        <subtitle>{info.model}</subtitle>
        <title>{info.name}</title>
      </column>
      <column>
        <danger-zone class="top">
          <attribute class="horizontal">
            <attribute-label>{attribute.pointValue.label}</attribute-label>
            <attribute-field>{attributes.pointValue.field</attribute-field>
          </attribute>
        </danger-zone>
      </column>
    </row>
    <row>
      <column>
        <card>
          <card-title>{attributes.title}</card-title>
          <row>
            <attribute class="horizontal">
              <attribute-label>{attributes.type.label}</attribute-label>
              <attribute-field>{attributes.type.field</attribute-field>
            </attribute>
            <attribute class="horizontal">
              <attribute-label>{attributes.size.label}</attribute-label>
              <attribute-field>{attributes.size.field</attribute-field>
            </attribute>
            <attribute class="horizontal">
              <attribute-label>{attributes.totalMovementModifier.label}</attribute-label>
              <attribute-field>{attributes.totalMovementModifier.field</attribute-field>
            </attribute>
            <attribute class="horizontal">
              <attribute-label>{attributes.movement.label}</attribute-label>
              <attribute-field>{attributes.movement.field</attribute-field>
            </attribute>
          </row>
          <row>
            <attribute class="horizontal">
              <attribute-label>{attributes.role.label}</attribute-label>
              <attribute-field>{attributes.role.field</attribute-field>
            </attribute>
            <attribute class="horizontal">
              <attribute-label>{attributes.skill.label}</attribute-label>
              <attribute-field>{attributes.skill.field</attribute-field>
            </attribute>
            <attribute class="horizontal">
              <attribute-label>{attributes.era.label}</attribute-label>
              <attribute-field>{attributes.era.field</attribute-field>
            </attribute>
          </row>
        </card>
        <card>
          <card-title>{damage.title}</card-title>
          <row>
            <attribute class="vertical">
              <attribute-label>{damage.short.label}</attribute-label>
              <attribute-field>{damage.short.field</attribute-field>
            </attribute>
            <attribute class="vertical">
              <attribute-label>{damage.medium.label}</attribute-label>
              <attribute-field>{damage.medium.field</attribute-field>
            </attribute>
            <attribute class="vertical">
              <attribute-label>{damage.long.label}</attribute-label>
              <attribute-field>{damage.long.field</attribute-field>
            </attribute>
          </row>
        </card>
      </column>
      <column>
        <image>
      </column>
    </row>
    <row>
      <card>
        <card-title>{heat.title}</card-title>
        <row>
          <attribute class="horizontal">
            <attribute-label>{heat.overload.label}</attribute-label>
            <attribute-field>{heat.overload.field</attribute-field>
          </attribute>
          <divider class="vertical"></divider>
          <attribute class="horizontal">
            <attribute-label>{heat.heatScale.label}</attribute-label>
            <attribute-field>{heat.heatScale.levels[]}</attribute-field>
          </attribute>
        </row>
      </card>
    </row>
    <row>
      <card>
        <card-title>{special.title}</card-title>
        <attribute class="horizontal">
          <attribute-field>{special.field</attribute-field>
        </attribute>
      </card>
    </row>
    <row>
      <column>
        <card>
          <card-title>{armor.title}</card-title>
          <column>
            <attribute class="horizontal">
              <attribute-label>{armor.count.label}</attribute-label>
              <attribute-field>{armor.count.field</attribute-field>
            </attribute>
            <attribute class="horizontal">
              <attribute-label>{armor.structure.label}</attribute-label>
              <attribute-field>{armor.structure.field</attribute-field>
            </attribute>
          </column>
        </card>
      </column>
      <column>
        <card>
          <card-title>{crits[key]}</card-title>
          <column>
            <attribute class="horizontal">
              <attribute-label>{crits.engine.label}</attribute-label>
              <attribute-label>{crits.engine.count}</attribute-label>
              <attribute-field>{crits.engine.modifier}</attribute-field>
            </attribute>
            <attribute class="horizontal">
              <attribute-label>{crits.fireControl.label}</attribute-label>
              <attribute-label>{crits.fireControl.count}</attribute-label>
              <attribute-field>{crits.fireControl.modifier}</attribute-field>
            </attribute>
            <attribute class="horizontal">
              <attribute-label>{crits.mobilityPoints.label}</attribute-label>
              <attribute-label>{crits.mobilityPoints.count}</attribute-label>
              <attribute-field>{crits.mobilityPoints.modifier}</attribute-field>
            </attribute>
            <attribute class="horizontal">
              <attribute-label>{crits.weapons.label}</attribute-label>
              <attribute-label>{crits.weapons.count}</attribute-label>
              <attribute-field>{crits.weapons.modifier}</attribute-field>
              <attribute-field>{crits.weapons.modifierLabel}</attribute-field>
            </attribute>
          </column>
        </card>
      </column>
    </row>
    <row>
      <danger-zone class="bottom">
        <attribute class="horizontal">
          <attribute-field>ALPHA STRIKE STATS</attribute-field>
        </attribute>
      </danger-zone>
    </row>
  </mech>
</template>

<script>
export default {
  const mech = {

  }
};
</script>